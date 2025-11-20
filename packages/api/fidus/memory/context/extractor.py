"""Dynamic context extraction using LLM.

This module provides LLM-based extraction of situational context from user messages.
The context factors are discovered dynamically (schema-less design) rather than
using a predefined schema.
"""

import json
import logging
import os
from datetime import datetime
from typing import Optional
from zoneinfo import ZoneInfo

from litellm import completion
from tenacity import retry, stop_after_attempt, wait_exponential

from fidus.config import config
from fidus.memory.context.models import ContextFactors, ContextExtractionResult

logger = logging.getLogger(__name__)


class DynamicContextExtractor:
    """Extract context factors dynamically from user messages using LLM.

    This class uses an LLM to analyze user messages and identify relevant
    context factors. The LLM discovers factors organically rather than
    following a fixed schema, allowing for flexible context representation.

    Example:
        extractor = DynamicContextExtractor()
        result = await extractor.extract("I need coffee, it's 9am")
        # result.context.factors = {"time_of_day": "morning", "beverage": "coffee"}
    """

    SYSTEM_PROMPT = """You are a context extraction assistant for Fidus Memory.

Your task is to analyze user messages and extract relevant situational context factors.
Context factors should be:
1. In snake_case format (lowercase with underscores)
2. Descriptive and specific
3. Relevant to understanding user preferences
4. Focused on the situation, not the preference itself

Examples of good context factors:
- time_of_day: "morning", "afternoon", "evening", "night"
- day_of_week: "monday", "tuesday", etc.
- location: "home", "work", "cafe", "gym"
- weather: "sunny", "rainy", "cold", "hot"
- activity: "working", "relaxing", "exercising", "socializing"
- mood: "energetic", "tired", "stressed", "happy"
- season: "spring", "summer", "fall", "winter"

Extract factors organically - you can discover new factor types beyond these examples.

Response format (JSON):
{
  "context_factors": {
    "factor_name": "factor_value",
    ...
  },
  "confidence": 0.95,
  "explanation": "Brief explanation of extraction"
}

If no clear context is found, return empty context_factors with low confidence.
"""

    USER_PROMPT_TEMPLATE = """Analyze this user message and extract relevant context factors:

Current Date and Time: {current_datetime}
Message: "{message}"

Extract context factors that help understand the situation. Use the current date and time to infer temporal context like time_of_day, day_of_week, season, etc.

IMPORTANT: You MUST respond with ONLY valid JSON in exactly this format (no other text, no markdown, no code blocks):
{{"context_factors": {{}}, "confidence": 0.0, "explanation": "your explanation"}}"""

    def __init__(
        self,
        model: Optional[str] = None,
        temperature: float = 0.3,
        max_tokens: int = 500,
    ):
        """Initialize the context extractor.

        Args:
            model: LLM model to use (defaults to config.llm_model)
            temperature: LLM temperature for response variability
            max_tokens: Maximum tokens in LLM response
        """
        self.model = model or config.llm_model
        self.temperature = temperature
        self.max_tokens = max_tokens

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True,
    )
    async def extract(
        self,
        message: str,
        tenant_id: str,
        user_id: str,
    ) -> ContextExtractionResult:
        """Extract context factors from a user message.

        This method uses an LLM to analyze the message and identify relevant
        context factors. The extraction includes retry logic for reliability.

        Args:
            message: User message to analyze
            tenant_id: Tenant ID for logging and tracking
            user_id: User ID for logging and tracking

        Returns:
            ContextExtractionResult: Extracted context with confidence score

        Raises:
            ValueError: If LLM response cannot be parsed
            Exception: If LLM call fails after retries
        """
        logger.info(
            f"Extracting context from message",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
                "message_length": len(message),
            },
        )

        try:
            # Get current datetime for temporal context in Europe/Berlin timezone
            timezone = os.getenv("TZ", "Europe/Berlin")
            try:
                tz = ZoneInfo(timezone)
                current_datetime = datetime.now(tz).strftime("%A, %Y-%m-%d %H:%M:%S %Z")
            except Exception:
                # Fallback to UTC if timezone not found
                current_datetime = datetime.now().strftime("%A, %Y-%m-%d %H:%M:%S UTC")

            # Call LLM for context extraction
            # Using streaming to work around Ollama/LiteLLM non-streaming empty response bug
            response = completion(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {
                        "role": "user",
                        "content": self.USER_PROMPT_TEMPLATE.format(
                            current_datetime=current_datetime,
                            message=message
                        ),
                    },
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                stream=True,
                # response_format removed for Ollama compatibility via LiteLLM
            )

            # Collect streaming response
            content = ""
            chunk_count = 0
            for chunk in response:
                chunk_count += 1
                if chunk.choices and len(chunk.choices) > 0:
                    delta = chunk.choices[0].delta
                    # qwen3 uses 'reasoning_content' for all output, other models use 'content'
                    delta_content = getattr(delta, 'content', None) or getattr(delta, 'reasoning_content', None)
                    if delta_content is not None:
                        content += str(delta_content)
            logger.info(f"Total chunks received: {chunk_count}, final content length: {len(content)}")

            # Clean up response - remove markdown code blocks if present
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:]  # Remove ```json
            elif content.startswith("```"):
                content = content[3:]  # Remove ```
            if content.endswith("```"):
                content = content[:-3]  # Remove trailing ```
            content = content.strip()

            # qwen3 may include reasoning before JSON - extract JSON object
            # Look for the first occurrence of {"context_factors"
            json_start = content.find('{"context_factors"')
            if json_start > 0:
                logger.debug(f"Found JSON at position {json_start}, removing {json_start} characters of reasoning")
                content = content[json_start:]
                content = content.strip()
            elif json_start == -1:
                # Try finding any JSON object
                json_start = content.find('{')
                if json_start > 0:
                    logger.debug(f"Found JSON object at position {json_start}")
                    content = content[json_start:]
                    content = content.strip()

            # Parse JSON response
            try:
                parsed = json.loads(content)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse LLM response as JSON: {e}")
                logger.error(f"Raw content (first 500 chars): {content[:500]}")
                raise ValueError(f"Invalid JSON response from LLM")

            # Extract context factors
            context_factors = parsed.get("context_factors", {})
            confidence = float(parsed.get("confidence", 0.0))
            explanation = parsed.get("explanation")

            # Validate and create ContextFactors
            try:
                context = ContextFactors(factors=context_factors)
            except ValueError as e:
                logger.warning(f"Invalid context factors from LLM: {e}")
                # Return empty context with low confidence if validation fails
                context = ContextFactors(factors={})
                confidence = 0.0
                explanation = f"Validation failed: {str(e)}"

            result = ContextExtractionResult(
                context=context,
                confidence=confidence,
                explanation=explanation,
            )

            logger.info(
                f"Context extracted successfully",
                extra={
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                    "factors_count": len(context.factors),
                    "confidence": confidence,
                },
            )

            return result

        except Exception as e:
            logger.error(
                f"Context extraction failed: {e}",
                extra={"tenant_id": tenant_id, "user_id": user_id},
            )
            raise

    def extract_sync(
        self,
        message: str,
        tenant_id: str,
        user_id: str,
    ) -> ContextExtractionResult:
        """Synchronous version of extract() for non-async contexts.

        Args:
            message: User message to analyze
            tenant_id: Tenant ID for logging and tracking
            user_id: User ID for logging and tracking

        Returns:
            ContextExtractionResult: Extracted context with confidence score
        """
        logger.info(
            f"Extracting context from message (sync)",
            extra={
                "tenant_id": tenant_id,
                "user_id": user_id,
                "message_length": len(message),
            },
        )

        try:
            # Get current datetime for temporal context in Europe/Berlin timezone
            timezone = os.getenv("TZ", "Europe/Berlin")
            try:
                tz = ZoneInfo(timezone)
                current_datetime = datetime.now(tz).strftime("%A, %Y-%m-%d %H:%M:%S %Z")
            except Exception:
                # Fallback to UTC if timezone not found
                current_datetime = datetime.now().strftime("%A, %Y-%m-%d %H:%M:%S UTC")

            # Call LLM for context extraction
            # Using streaming to work around Ollama/LiteLLM non-streaming empty response bug
            response = completion(
                model=self.model,
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {
                        "role": "user",
                        "content": self.USER_PROMPT_TEMPLATE.format(
                            current_datetime=current_datetime,
                            message=message
                        ),
                    },
                ],
                temperature=self.temperature,
                max_tokens=self.max_tokens,
                stream=True,
                # response_format removed for Ollama compatibility via LiteLLM
            )

            # Collect streaming response
            content = ""
            chunk_count = 0
            for chunk in response:
                chunk_count += 1
                if chunk.choices and len(chunk.choices) > 0:
                    delta = chunk.choices[0].delta
                    # qwen3 uses 'reasoning_content' for all output, other models use 'content'
                    delta_content = getattr(delta, 'content', None) or getattr(delta, 'reasoning_content', None)
                    if delta_content is not None:
                        content += str(delta_content)
            logger.info(f"Total chunks received: {chunk_count}, final content length: {len(content)}")

            # Clean up response - remove markdown code blocks if present
            content = content.strip()
            if content.startswith("```json"):
                content = content[7:]  # Remove ```json
            elif content.startswith("```"):
                content = content[3:]  # Remove ```
            if content.endswith("```"):
                content = content[:-3]  # Remove trailing ```
            content = content.strip()

            # qwen3 may include reasoning before JSON - extract JSON object
            # Look for the first occurrence of {"context_factors"
            json_start = content.find('{"context_factors"')
            if json_start > 0:
                logger.debug(f"Found JSON at position {json_start}, removing {json_start} characters of reasoning")
                content = content[json_start:]
                content = content.strip()
            elif json_start == -1:
                # Try finding any JSON object
                json_start = content.find('{')
                if json_start > 0:
                    logger.debug(f"Found JSON object at position {json_start}")
                    content = content[json_start:]
                    content = content.strip()

            # Parse JSON response
            try:
                parsed = json.loads(content)
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse LLM response as JSON: {e}")
                logger.error(f"Raw content (first 500 chars): {content[:500]}")
                raise ValueError(f"Invalid JSON response from LLM")

            # Extract context factors
            context_factors = parsed.get("context_factors", {})
            confidence = float(parsed.get("confidence", 0.0))
            explanation = parsed.get("explanation")

            # Validate and create ContextFactors
            try:
                context = ContextFactors(factors=context_factors)
            except ValueError as e:
                logger.warning(f"Invalid context factors from LLM: {e}")
                # Return empty context with low confidence if validation fails
                context = ContextFactors(factors={})
                confidence = 0.0
                explanation = f"Validation failed: {str(e)}"

            result = ContextExtractionResult(
                context=context,
                confidence=confidence,
                explanation=explanation,
            )

            logger.info(
                f"Context extracted successfully",
                extra={
                    "tenant_id": tenant_id,
                    "user_id": user_id,
                    "factors_count": len(context.factors),
                    "confidence": confidence,
                },
            )

            return result

        except Exception as e:
            logger.error(
                f"Context extraction failed: {e}",
                extra={"tenant_id": tenant_id, "user_id": user_id},
            )
            raise
