"""
LLM-based person extraction from conversations.

Uses LiteLLM to extract Person entities from natural language.
"""

from typing import List, Optional
import json
import logging

from litellm import acompletion

from fidus.memory.entities.person import PersonCreate
from fidus.config import config

logger = logging.getLogger(__name__)


class PersonEntityExtractor:
    """
    Extract Person entities from natural language conversations.

    Uses structured LLM prompts to identify:
    - Name (required)
    - Profession (optional)
    - Topics of interest (optional)
    - Communication style (optional)
    - Any other relevant attributes
    """

    EXTRACTION_PROMPT = """
You are an entity extraction specialist. Extract person information from the following conversation.

Extract:
- name (REQUIRED): Person's full name as mentioned
- profession (OPTIONAL): Job title or role (e.g., "Software Engineer", "Doctor", "Student")
- topics (OPTIONAL): Topics of interest as list (e.g., ["Python", "AI", "Photography"])
- communication_style (OPTIONAL): Brief description of how they communicate
- company (OPTIONAL): Company or organization they work at
- Any other relevant attributes you discover

IMPORTANT:
- Only extract if person is explicitly mentioned. Don't infer people not directly referenced.
- Extract the user's description, not your own assumptions.
- If the same person is mentioned multiple times, consolidate into one entry.

Conversation:
{conversation}

Output as JSON (output ONLY valid JSON, no markdown):
{{
  "persons": [
    {{
      "name": "string (required)",
      "profession": "string or null",
      "topics": ["string"] or null,
      "communication_style": "string or null",
      "company": "string or null"
    }}
  ]
}}
"""

    def __init__(self, model: Optional[str] = None):
        """
        Initialize the PersonEntityExtractor.

        Args:
            model: LLM model to use. Defaults to config.context_extraction_model.
        """
        self.model = model or config.context_extraction_model

    async def extract_from_conversation(
        self, conversation: str
    ) -> List[PersonCreate]:
        """
        Extract Person entities from conversation text.

        Args:
            conversation: User conversation text

        Returns:
            List of PersonCreate objects (may be empty if no persons found)
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

            persons = []
            for person_data in data.get("persons", []):
                if not person_data.get("name"):
                    continue  # Skip if no name

                # Build ai_properties from all extracted fields except name
                ai_properties = {}
                for key, value in person_data.items():
                    if key != "name" and value is not None:
                        ai_properties[key] = value

                persons.append(
                    PersonCreate(
                        name=person_data["name"],
                        ai_properties=ai_properties,
                        confidence=0.85,  # LLM extraction has slightly lower confidence
                        source="llm_extracted",
                    )
                )

            logger.info(
                f"Extracted {len(persons)} person(s) from conversation",
                extra={"person_count": len(persons)},
            )
            return persons

        except json.JSONDecodeError as e:
            logger.warning(f"Failed to parse LLM response as JSON: {e}")
            return []
        except Exception as e:
            # Log error but don't crash
            logger.error(f"Person extraction failed: {e}", exc_info=True)
            return []

    async def extract_single(self, conversation: str) -> Optional[PersonCreate]:
        """
        Extract a single person (convenience method).

        Returns first extracted person or None.
        """
        persons = await self.extract_from_conversation(conversation)
        return persons[0] if persons else None
