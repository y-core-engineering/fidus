"""Context extraction and storage for situational awareness.

This package provides situational context awareness for Fidus Memory,
enabling the system to differentiate preferences based on context
(e.g., "cappuccino in morning" vs "espresso in afternoon").

Main Components:
- DynamicContextExtractor: LLM-based context extraction
- SystemContextProvider: Automatic context from time/date/etc.
- ContextMerger: Merge LLM and system context
- EmbeddingService: Generate vector embeddings
- ContextStorageService: Store in Neo4j + Qdrant
- ContextRetrievalService: Similarity-based search
- ContextAwareAgent: Main orchestration agent
- Domain Events: Event-driven architecture support
- Input Sanitization: Security and validation
"""

from fidus.memory.context.agent import ContextAwareAgent
from fidus.memory.context.embedding_service import EmbeddingService
from fidus.memory.context.events import (
    ContextExtracted,
    ContextExtractionFailed,
    EmbeddingGenerationFailed,
    EventPublisher,
    PreferenceLinkedToSituation,
    SimilarSituationsFound,
    SituationStored,
    SituationStorageFailed,
    event_publisher,
)
from fidus.memory.context.extractor import DynamicContextExtractor
from fidus.memory.context.merger import ContextMerger
from fidus.memory.context.models import (
    ContextExtractionResult,
    ContextFactors,
    Situation,
)
from fidus.memory.context.retrieval import ContextRetrievalService
from fidus.memory.context.sanitization import InputSanitizer, RateLimiter
from fidus.memory.context.storage import ContextStorageService
from fidus.memory.context.system_provider import SystemContextProvider

__all__ = [
    # Main Agent
    "ContextAwareAgent",
    # Core Services
    "DynamicContextExtractor",
    "SystemContextProvider",
    "ContextMerger",
    "EmbeddingService",
    "ContextStorageService",
    "ContextRetrievalService",
    # Models
    "ContextFactors",
    "Situation",
    "ContextExtractionResult",
    # Events
    "ContextExtracted",
    "SituationStored",
    "PreferenceLinkedToSituation",
    "SimilarSituationsFound",
    "ContextExtractionFailed",
    "EmbeddingGenerationFailed",
    "SituationStorageFailed",
    "EventPublisher",
    "event_publisher",
    # Security
    "InputSanitizer",
    "RateLimiter",
]
