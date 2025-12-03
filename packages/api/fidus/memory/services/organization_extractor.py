"""
LLM-based organization extraction from conversations.

Uses LiteLLM to extract Organization entities from natural language.
"""

from typing import Any, List, Optional
import json
import logging

from litellm import acompletion

from fidus.memory.entities.organization import OrganizationCreate
from fidus.config import config

logger = logging.getLogger(__name__)


class OrganizationEntityExtractor:
    """
    Extract Organization entities from natural language conversations.

    Uses structured LLM prompts to identify:
    - Name (required)
    - Industry (optional)
    - Size (optional)
    - Location (optional)
    - Description (optional)
    - Any other relevant attributes
    """

    EXTRACTION_PROMPT = """
You are an entity extraction specialist. Extract organization information from the following conversation.

Extract:
- name (REQUIRED): Organization's full name as mentioned
- industry (OPTIONAL): Business sector (e.g., "Technology", "Healthcare", "Finance", "AI Safety")
- size (OPTIONAL): Company size (e.g., "startup", "small", "mid", "large", "enterprise")
- location (OPTIONAL): Headquarters or main location (e.g., "San Francisco", "Berlin")
- culture (OPTIONAL): Brief description of company culture
- description (OPTIONAL): Brief description of what the organization does
- Any other relevant attributes you discover

IMPORTANT:
- Only extract if organization is explicitly mentioned. Don't infer organizations not directly referenced.
- Organizations include: companies, startups, teams, departments, institutions, non-profits, government agencies.
- Extract the user's description, not your own assumptions.
- If the same organization is mentioned multiple times, consolidate into one entry.
- Extract organizations the user works at, mentions, or interacts with.

Conversation:
{conversation}

Output as JSON (output ONLY valid JSON, no markdown):
{{
  "organizations": [
    {{
      "name": "string (required)",
      "industry": "string or null",
      "size": "string or null",
      "location": "string or null",
      "culture": "string or null",
      "description": "string or null"
    }}
  ]
}}
"""

    def __init__(self, model: Optional[str] = None):
        """
        Initialize the OrganizationEntityExtractor.

        Args:
            model: LLM model to use. Defaults to config.context_extraction_model.
        """
        self.model = model or config.context_extraction_model

    async def extract_from_conversation(
        self, conversation: str
    ) -> List[OrganizationCreate]:
        """
        Extract Organization entities from conversation text.

        Args:
            conversation: User conversation text

        Returns:
            List of OrganizationCreate objects (may be empty if no organizations found)
        """
        if not conversation or len(conversation.strip()) < 5:
            return []

        prompt = self.EXTRACTION_PROMPT.format(conversation=conversation)

        try:
            response = await acompletion(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,  # Low temperature for consistent extraction
                response_format={"type": "json_object"},
            )

            content = response.choices[0].message.content
            data = json.loads(content)

            organizations = []
            for org_data in data.get("organizations", []):
                if not org_data.get("name"):
                    continue  # Skip if no name

                # Build ai_properties from all extracted fields except name
                ai_properties: dict[str, Any] = {}
                for key, value in org_data.items():
                    if key != "name" and value is not None:
                        ai_properties[key] = value

                organizations.append(
                    OrganizationCreate(
                        name=org_data["name"],
                        ai_properties=ai_properties,
                        confidence=0.85,  # LLM extraction has slightly lower confidence
                        source="llm_extracted",
                    )
                )

            logger.info(
                f"Extracted {len(organizations)} organization(s) from conversation",
                extra={"organization_count": len(organizations)},
            )
            return organizations

        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse LLM response as JSON: {e}")
            return []
        except Exception as e:
            # Log error but don't crash
            logger.error(f"Organization extraction failed: {e}", exc_info=True)
            return []

    async def extract_single(self, conversation: str) -> Optional[OrganizationCreate]:
        """
        Extract a single organization (convenience method).

        Returns first extracted organization or None.
        """
        organizations = await self.extract_from_conversation(conversation)
        return organizations[0] if organizations else None
