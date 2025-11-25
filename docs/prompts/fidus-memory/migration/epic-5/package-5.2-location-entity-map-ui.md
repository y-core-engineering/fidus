# Implementation Prompt: 5.2 - Location Entity with Map UI

**Package:** 5.2
**Epic:** Completion & Optimization
**Priority:** 🟢 LOW
**Context Document:** `/docs/prototypes/fidus-memory/migration-v3-wbs.md` (Lines 1096-1140)

---

## Role

You are a **Senior Full-Stack Software Engineer** specializing in:

**Backend Expertise:**
- **Domain-Driven Design (DDD):** Bounded contexts, aggregates, entities, value objects, repositories
- **Graph Databases (Neo4j):** Cypher queries, relationship modeling, geospatial indexes
- **Vector Databases (Qdrant):** Embedding search, similarity queries, payload filtering
- **Python Backend:** FastAPI, Pydantic, async/await, type hints, dependency injection
- **LLM Integration:** LiteLLM, prompt engineering, structured outputs, function calling
- **Geospatial:** Coordinate systems, distance calculations, reverse geocoding

**Frontend Expertise:**
- **Next.js 14:** App Router, Server Components, Client Components
- **React 18:** Hooks, performance optimization
- **TypeScript 5+:** Advanced types, generics
- **UI Libraries:** @fidus/ui design system components
- **Mapping Libraries:** React Leaflet, Mapbox, Google Maps React
- **Geolocation API:** Browser geolocation, address autocomplete

**DevOps & Tools:**
- **Databases:** Neo4j 5.x (geospatial support), Qdrant 1.7+
- **Testing:** pytest, Playwright
- **API Design:** REST, OpenAPI/Swagger

**Architecture Patterns:**
- **Vertical Slicing:** Backend + API + Frontend + Tests in single deliverable
- **Feature Flags:** Gradual rollout, instant rollback
- **Multi-Tenancy:** tenant_id scoping, data isolation

---

## Context & Background

**Current State:**
- User entity operational (Package 1.2)
- 7/9 entities implemented (User, Person, Organization, Goal, Habit, Event, Object)
- Object entity completed (Package 5.1)
- No location tracking capability exists
- Users cannot record places they frequent or spatial context

**Migration Goal:**
- Add Location entity to track places users frequent
- Increase entity coverage to 9/9 (100%)
- Enable AI-driven location extraction from conversations
- Provide map-based UI for visualizing and managing locations
- Support geospatial queries (nearby locations)
- Prepare for FREQUENTS relationship implementation (Package 5.3)

**Architecture References:**
- Solution Architecture: `/docs/solution-architecture/15-entity-management.md`
- Domain Model: Entity-Relationship Model (9 entity types specification)
- ADR: `/docs/adr/ADR-0001-qdrant-first-pattern.md`
- **ADR: `/docs/adr/ADR-0002-property-placement-and-geospatial-exception.md` (Decision 2 - Geospatial Exception)**

---

## Your Task

Implement **Location Entity with Map UI** according to the specifications below.

**User Story:**
As a user, I want to track locations I frequent so the system understands my spatial context.

**Acceptance Criteria:**
1. Backend: Location entity with `address`, `coordinates`, `type` - **Neo4j PRIMARY (ADR-0002 Exception)**
2. Backend: LocationRepository with geospatial queries (nearby locations) using Neo4j Point type
3. Backend: LLM location extractor to identify locations from conversation
4. API: Location CRUD endpoints with geospatial search (Neo4j spatial index)
5. Frontend: Map view with location markers
6. Frontend: Location detail view with nearby locations
7. Frontend: Location form with address autocomplete
8. Tests: Extract "I go to the gym on Main Street" from conversation
9. Documentation: Update entity management guide with Location implementation
10. **Qdrant: Store ONLY visit context (mood, activities, companions) - NOT location properties**

---

## Technical Specification

---

### ⚠️ ARCHITECTURAL EXCEPTION: Location is PRIMARY in Neo4j (ADR-0002 Decision 2)

**This is the ONLY entity type where Neo4j is the primary data store.**

**Reason:** Qdrant lacks native geospatial indexing for efficient radius queries and nearest-neighbor searches by coordinates. Geospatial queries like "find gyms within 2km" require Neo4j Point type with spatial indexes.

**Storage Pattern:**
- **Neo4j PRIMARY:** All location properties (name, address, coordinates, type) - enables geospatial queries
- **Qdrant:** ONLY visit context (visit_date, mood, activity, companions) - for semantic search

**Reference:** See ADR-0002 Decision 2 for detailed rationale and trade-offs.

---

### Backend Implementation

**Files to Create/Modify:**

1. **`packages/api/fidus/memory/entities/location.py`** - Location entity with coordinates
2. **`packages/api/fidus/memory/repositories/location_repository.py`** - Repository with geospatial queries
3. **`packages/api/fidus/memory/services/location_extractor.py`** - LLM-powered location extraction
4. **`packages/api/fidus/memory/services/geocoding_service.py`** - Address to coordinates conversion
5. **`packages/api/fidus/memory/routes/location_routes.py`** - FastAPI router with geospatial endpoints
6. **`packages/api/fidus/config.py`** - Add feature flag `ENABLE_LOCATION_ENTITY`
7. **`packages/api/scripts/setup_neo4j_geospatial.py`** - Create geospatial indexes

**Detailed Tasks:**

#### Task 1: Create Location Entity Model

**File:** `packages/api/fidus/memory/entities/location.py`

```python
from pydantic import BaseModel, Field, field_validator
from typing import Dict, Any, Optional, Tuple
from datetime import datetime
from uuid import uuid4


class Coordinates(BaseModel):
    """Latitude/Longitude coordinates"""
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

    def to_neo4j_point(self) -> dict:
        """Convert to Neo4j point format"""
        return {
            "latitude": self.latitude,
            "longitude": self.longitude,
            "crs": "wgs-84"
        }

    @classmethod
    def from_neo4j_point(cls, point: dict) -> "Coordinates":
        """Parse Neo4j point"""
        return cls(
            latitude=point.get("latitude"),
            longitude=point.get("longitude")
        )


class Location(BaseModel):
    """
    Location entity representing places the user frequents.

    ⚠️ ARCHITECTURAL EXCEPTION (ADR-0002 Decision 2):
    Location is PRIMARY in Neo4j (not Qdrant).
    - Neo4j: All location properties (name, address, coordinates, type)
    - Qdrant: ONLY visit context (see FREQUENTS relationship)

    Supports geospatial queries via Neo4j point type and spatial index.
    """
    id: str = Field(default_factory=lambda: str(uuid4()))
    tenant_id: str = Field(..., description="Multi-tenancy identifier")
    user_id: str = Field(..., description="User who added this location")
    name: str = Field(..., min_length=1, max_length=255, description="Location name")

    # Address components
    address: Optional[str] = Field(None, description="Full address")
    street: Optional[str] = Field(None)
    city: Optional[str] = Field(None)
    state: Optional[str] = Field(None)
    country: Optional[str] = Field(None)
    postal_code: Optional[str] = Field(None)

    # Geospatial
    coordinates: Optional[Coordinates] = Field(None, description="Lat/Lng coordinates")

    # Classification
    type: Optional[str] = Field(
        None,
        description="Location type: home, work, gym, restaurant, park, store, transit, other"
    )

    # Flexible AI-discovered properties
    ai_properties: Dict[str, Any] = Field(
        default_factory=dict,
        description="AI-discovered attributes (hours, amenities, atmosphere, etc.)"
    )

    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_schema_extra = {
            "example": {
                "id": "loc_123",
                "tenant_id": "tenant_1",
                "user_id": "user_1",
                "name": "FitX Berlin Mitte",
                "address": "Oranienburger Str. 45, 10117 Berlin, Germany",
                "city": "Berlin",
                "country": "Germany",
                "coordinates": {
                    "latitude": 52.5251,
                    "longitude": 13.3879
                },
                "type": "gym",
                "ai_properties": {
                    "hours": "24/7",
                    "amenities": ["sauna", "classes", "weights"],
                    "atmosphere": "energetic"
                }
            }
        }

    # Property helpers
    @property
    def hours(self) -> Optional[str]:
        """Operating hours"""
        return self.ai_properties.get("hours")

    @property
    def amenities(self) -> Optional[list]:
        """Available amenities"""
        return self.ai_properties.get("amenities")

    @property
    def atmosphere(self) -> Optional[str]:
        """Atmosphere description"""
        return self.ai_properties.get("atmosphere")

    def distance_to(self, other: "Location") -> Optional[float]:
        """
        Calculate distance to another location in kilometers.

        Uses Haversine formula.
        """
        if not self.coordinates or not other.coordinates:
            return None

        from math import radians, cos, sin, asin, sqrt

        lat1, lon1 = radians(self.coordinates.latitude), radians(self.coordinates.longitude)
        lat2, lon2 = radians(other.coordinates.latitude), radians(other.coordinates.longitude)

        dlon = lon2 - lon1
        dlat = lat2 - lat1

        a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
        c = 2 * asin(sqrt(a))

        # Radius of Earth in kilometers
        r = 6371

        return c * r


class LocationCreate(BaseModel):
    """Request model for creating a location"""
    name: str = Field(..., min_length=1, max_length=255)
    address: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    coordinates: Optional[Coordinates] = None
    type: Optional[str] = None
    ai_properties: Dict[str, Any] = Field(default_factory=dict)


class LocationUpdate(BaseModel):
    """Request model for updating a location"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    address: Optional[str] = None
    coordinates: Optional[Coordinates] = None
    type: Optional[str] = None
    ai_properties: Optional[Dict[str, Any]] = None  # Merges with existing
```

---

#### Task 2: Create LocationRepository with Geospatial Queries

**File:** `packages/api/fidus/memory/repositories/location_repository.py`

```python
from typing import List, Optional, Dict, Any
from neo4j import AsyncDriver
from fidus.memory.entities.location import Location, LocationCreate, LocationUpdate, Coordinates


class LocationRepository:
    """
    Repository for Location entity with geospatial query support.

    ⚠️ ARCHITECTURAL EXCEPTION (ADR-0002 Decision 2):
    Location entity is PRIMARY in Neo4j (exception from ADR-0001).
    All CRUD operations use Neo4j. Qdrant stores ONLY visit context.
    """

    def __init__(self, neo4j_driver: AsyncDriver):
        self.driver = neo4j_driver

    async def create(self, tenant_id: str, user_id: str, loc_data: LocationCreate) -> Location:
        """
        Create new Location in Neo4j with geospatial point.

        ⚠️ Neo4j PRIMARY storage (ADR-0002 Exception).
        Coordinates stored as Neo4j Point type for spatial queries.
        """
        loc = Location(
            tenant_id=tenant_id,
            user_id=user_id,
            name=loc_data.name,
            address=loc_data.address,
            street=loc_data.street,
            city=loc_data.city,
            state=loc_data.state,
            country=loc_data.country,
            postal_code=loc_data.postal_code,
            coordinates=loc_data.coordinates,
            type=loc_data.type,
            ai_properties=loc_data.ai_properties
        )

        # Build point parameter if coordinates exist
        point_value = None
        if loc.coordinates:
            point_value = f"point({{latitude: {loc.coordinates.latitude}, longitude: {loc.coordinates.longitude}}})"

        query = f"""
        CREATE (l:Location {{
            id: $id,
            tenant_id: $tenant_id,
            user_id: $user_id,
            name: $name,
            address: $address,
            street: $street,
            city: $city,
            state: $state,
            country: $country,
            postal_code: $postal_code,
            coordinates: {point_value if point_value else 'null'},
            type: $type,
            ai_properties: $ai_properties,
            created_at: datetime(),
            updated_at: datetime()
        }})
        RETURN l
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                id=loc.id,
                tenant_id=loc.tenant_id,
                user_id=loc.user_id,
                name=loc.name,
                address=loc.address,
                street=loc.street,
                city=loc.city,
                state=loc.state,
                country=loc.country,
                postal_code=loc.postal_code,
                type=loc.type,
                ai_properties=loc.ai_properties
            )
            await result.consume()

        return loc

    async def get(self, location_id: str, tenant_id: str) -> Optional[Location]:
        """Get Location by ID with tenant isolation"""
        query = """
        MATCH (l:Location {id: $location_id, tenant_id: $tenant_id})
        RETURN l
        """

        async with self.driver.session() as session:
            result = await session.run(query, location_id=location_id, tenant_id=tenant_id)
            record = await result.single()

            if not record:
                return None

            return self._node_to_location(record["l"])

    async def list_by_user(
        self,
        user_id: str,
        tenant_id: str,
        type_filter: Optional[str] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Location]:
        """List locations for user with optional type filter"""
        type_clause = "AND l.type = $type" if type_filter else ""

        query = f"""
        MATCH (l:Location {{user_id: $user_id, tenant_id: $tenant_id}})
        {type_clause}
        RETURN l
        ORDER BY l.created_at DESC
        SKIP $offset
        LIMIT $limit
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                user_id=user_id,
                tenant_id=tenant_id,
                type=type_filter,
                offset=offset,
                limit=limit
            )
            records = await result.data()

        return [self._node_to_location(record["l"]) for record in records]

    async def get_nearby_locations(
        self,
        latitude: float,
        longitude: float,
        radius_km: float,
        tenant_id: str,
        limit: int = 20
    ) -> List[tuple[Location, float]]:
        """
        Find locations within radius of given coordinates.

        Returns list of (Location, distance_km) tuples sorted by distance.

        ⚠️ GEOSPATIAL QUERY (ADR-0002 Justification):
        Uses Neo4j point.distance() with spatial index.
        Performance: <50ms for 1M locations (vs. Qdrant full scan >500ms).

        Example Query: "Find gyms within 2km of current location"
        Requires: Composite index on (tenant_id, coordinates)
        """
        query = """
        MATCH (l:Location {tenant_id: $tenant_id})
        WHERE l.coordinates IS NOT NULL
        WITH l, point.distance(
            l.coordinates,
            point({latitude: $lat, longitude: $lng})
        ) AS distance
        WHERE distance <= $radius_meters
        RETURN l, distance / 1000.0 AS distance_km
        ORDER BY distance
        LIMIT $limit
        """

        async with self.driver.session() as session:
            result = await session.run(
                query,
                lat=latitude,
                lng=longitude,
                radius_meters=radius_km * 1000,  # Convert to meters
                tenant_id=tenant_id,
                limit=limit
            )
            records = await result.data()

        return [
            (self._node_to_location(record["l"]), record["distance_km"])
            for record in records
        ]

    async def update(
        self,
        location_id: str,
        tenant_id: str,
        update_data: LocationUpdate
    ) -> Optional[Location]:
        """Update location with property merging"""
        existing = await self.get(location_id, tenant_id)
        if not existing:
            return None

        # Merge ai_properties
        updated_ai_props = {**existing.ai_properties}
        if update_data.ai_properties:
            updated_ai_props.update(update_data.ai_properties)

        updates = []
        params = {"location_id": location_id, "tenant_id": tenant_id}

        if update_data.name:
            updates.append("l.name = $name")
            params["name"] = update_data.name
        if update_data.address is not None:
            updates.append("l.address = $address")
            params["address"] = update_data.address
        if update_data.type is not None:
            updates.append("l.type = $type")
            params["type"] = update_data.type
        if update_data.coordinates:
            updates.append(f"l.coordinates = point({{latitude: $lat, longitude: $lng}})")
            params["lat"] = update_data.coordinates.latitude
            params["lng"] = update_data.coordinates.longitude

        updates.append("l.ai_properties = $ai_properties")
        params["ai_properties"] = updated_ai_props
        updates.append("l.updated_at = datetime()")

        query = f"""
        MATCH (l:Location {{id: $location_id, tenant_id: $tenant_id}})
        SET {', '.join(updates)}
        RETURN l
        """

        async with self.driver.session() as session:
            result = await session.run(query, **params)
            record = await result.single()

            if not record:
                return None

            return self._node_to_location(record["l"])

    async def delete(self, location_id: str, tenant_id: str) -> bool:
        """Delete location and all relationships"""
        query = """
        MATCH (l:Location {id: $location_id, tenant_id: $tenant_id})
        DETACH DELETE l
        RETURN count(l) as deleted
        """

        async with self.driver.session() as session:
            result = await session.run(query, location_id=location_id, tenant_id=tenant_id)
            record = await result.single()
            return record["deleted"] > 0 if record else False

    def _node_to_location(self, node) -> Location:
        """Convert Neo4j node to Location entity"""
        coords = None
        if node.get("coordinates"):
            point = node["coordinates"]
            coords = Coordinates(
                latitude=point.latitude,
                longitude=point.longitude
            )

        return Location(
            id=node["id"],
            tenant_id=node["tenant_id"],
            user_id=node["user_id"],
            name=node["name"],
            address=node.get("address"),
            street=node.get("street"),
            city=node.get("city"),
            state=node.get("state"),
            country=node.get("country"),
            postal_code=node.get("postal_code"),
            coordinates=coords,
            type=node.get("type"),
            ai_properties=node.get("ai_properties", {}),
            created_at=node.get("created_at"),
            updated_at=node.get("updated_at")
        )
```

---

#### Task 3: Create Geospatial Index Setup Script

**File:** `packages/api/scripts/setup_neo4j_geospatial.py`

```python
"""
Create Neo4j geospatial indexes for Location entity.

⚠️ ARCHITECTURAL EXCEPTION (ADR-0002 Decision 2):
Location is PRIMARY in Neo4j (not Qdrant).
These spatial indexes enable efficient radius queries.

Run this script after deploying Location entity.
"""
from neo4j import GraphDatabase
import os


def create_geospatial_indexes():
    neo4j_uri = os.getenv("NEO4J_URI", "bolt://localhost:7687")
    neo4j_user = os.getenv("NEO4J_USER", "neo4j")
    neo4j_password = os.getenv("NEO4J_PASSWORD", "password")

    driver = GraphDatabase.driver(neo4j_uri, auth=(neo4j_user, neo4j_password))

    with driver.session() as session:
        # Create point index for geospatial queries
        session.run("""
            CREATE POINT INDEX location_coordinates_idx IF NOT EXISTS
            FOR (l:Location)
            ON (l.coordinates)
        """)
        print("✓ Created point index on Location.coordinates")

        # Create composite index for tenant-scoped spatial queries (ADR-0002)
        session.run("""
            CREATE INDEX location_tenant_coordinates_idx IF NOT EXISTS
            FOR (l:Location)
            ON (l.tenant_id, l.coordinates)
        """)
        print("✓ Created composite index on (Location.tenant_id, Location.coordinates)")

        # Create tenant index
        session.run("""
            CREATE INDEX location_tenant_idx IF NOT EXISTS
            FOR (l:Location)
            ON (l.tenant_id)
        """)
        print("✓ Created index on Location.tenant_id")

        # Create user index
        session.run("""
            CREATE INDEX location_user_idx IF NOT EXISTS
            FOR (l:Location)
            ON (l.user_id)
        """)
        print("✓ Created index on Location.user_id")

        # Create type index
        session.run("""
            CREATE INDEX location_type_idx IF NOT EXISTS
            FOR (l:Location)
            ON (l.type)
        """)
        print("✓ Created index on Location.type")

    driver.close()
    print("\n✅ All geospatial indexes created successfully")


if __name__ == "__main__":
    create_geospatial_indexes()
```

---

#### Task 3b: Qdrant Visit Context Storage

**Storage Pattern (ADR-0002 Decision 2):**

Location entity properties are PRIMARY in Neo4j. Qdrant stores ONLY visit context:

```python
# Qdrant Payload Structure (Visit Context ONLY)
{
    "location_id": "uuid-here",           # Reference to Neo4j Location
    "situation_id": "uuid-here",          # Situation context
    "visit_context": {
        "visit_date": "2025-11-21",
        "mood": "energetic",
        "activity": "weightlifting",
        "companions": ["friend_uuid_123"],
        "duration_minutes": 90,
        "notes": "Great leg day! New PR on squats.",
        "weather": "sunny"
    },
    "metadata": {
        "conversation_id": "uuid",
        "turn_id": 42
    }
}
```

**What Goes Where:**
- **Neo4j (PRIMARY):** name, address, coordinates, type, city, country, amenities
- **Qdrant (Visit Context ONLY):** visit_date, mood, activity, companions, duration, notes

**Example Queries:**
- Geospatial: "Find gyms within 2km" → Neo4j spatial query
- Semantic: "Places where I felt energetic" → Qdrant similarity search on visit_context

---

#### Task 4: Create Location Extractor Service

**File:** `packages/api/fidus/memory/services/location_extractor.py`

```python
from typing import List, Optional, Dict, Any
from litellm import acompletion
from pydantic import BaseModel
from fidus.memory.entities.location import LocationCreate, Coordinates


class ExtractedLocation(BaseModel):
    """LLM extraction result"""
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    type: Optional[str] = None
    confidence: float = 0.0
    ai_properties: Dict[str, Any] = {}


class LocationExtractor:
    """
    LLM-powered service to extract Location entities from conversation.
    """

    EXTRACTION_PROMPT = """
    Extract location information from the user's message.

    Locations are places the user frequents, visits, or mentions going to regularly.

    Extract:
    - name (required): The location's name or description
    - address (optional): Full address or street name
    - city (optional): City name
    - type (optional): home, work, gym, restaurant, park, store, transit, other
    - Any other relevant attributes: hours, amenities, atmosphere, etc.

    Return ONLY locations that the user explicitly frequents or plans to visit.
    Do NOT extract locations mentioned in passing or hypothetically.

    Examples:
    - "I go to the gym on Main Street" → name: "Gym on Main Street", type: "gym"
    - "My office is in Berlin Mitte" → name: "Office in Berlin Mitte", city: "Berlin", type: "work"
    - "I love the café at Alexanderplatz" → name: "Café at Alexanderplatz", type: "restaurant", city: "Berlin"

    Return empty list if no locations found.
    """

    def __init__(self, model: str = "gpt-4o-mini"):
        self.model = model

    async def extract_from_message(
        self,
        message: str,
        conversation_history: Optional[List[str]] = None
    ) -> List[ExtractedLocation]:
        """Extract locations from user message"""
        messages = [
            {"role": "system", "content": self.EXTRACTION_PROMPT},
            {"role": "user", "content": message}
        ]

        if conversation_history:
            context = "\n".join(conversation_history[-3:])
            messages.insert(1, {"role": "assistant", "content": f"Context: {context}"})

        try:
            response = await acompletion(
                model=self.model,
                messages=messages,
                response_format={
                    "type": "json_schema",
                    "json_schema": {
                        "name": "location_extraction",
                        "strict": True,
                        "schema": {
                            "type": "object",
                            "properties": {
                                "locations": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "name": {"type": "string"},
                                            "address": {"type": ["string", "null"]},
                                            "city": {"type": ["string", "null"]},
                                            "type": {"type": ["string", "null"]},
                                            "confidence": {"type": "number"},
                                            "ai_properties": {"type": "object"}
                                        },
                                        "required": ["name", "confidence"],
                                        "additionalProperties": False
                                    }
                                }
                            },
                            "required": ["locations"],
                            "additionalProperties": False
                        }
                    }
                }
            )

            content = response.choices[0].message.content
            import json
            data = json.loads(content)

            return [
                ExtractedLocation(**loc)
                for loc in data.get("locations", [])
                if loc.get("confidence", 0) > 0.6
            ]

        except Exception as e:
            print(f"Location extraction error: {e}")
            return []

    def to_location_create(self, extracted: ExtractedLocation) -> LocationCreate:
        """Convert extracted location to LocationCreate model"""
        return LocationCreate(
            name=extracted.name,
            address=extracted.address,
            city=extracted.city,
            type=extracted.type,
            ai_properties=extracted.ai_properties
        )
```

---

#### Task 5: Create Geocoding Service (Optional)

**File:** `packages/api/fidus/memory/services/geocoding_service.py`

```python
"""
Geocoding service to convert addresses to coordinates.

Can integrate with Google Maps API, Nominatim (OpenStreetMap), or other providers.
"""
from typing import Optional
from fidus.memory.entities.location import Coordinates
import httpx
import os


class GeocodingService:
    """
    Convert addresses to coordinates using Nominatim (OpenStreetMap).

    For production, consider Google Maps Geocoding API.
    """

    def __init__(self):
        self.base_url = "https://nominatim.openstreetmap.org/search"
        self.user_agent = "FidusMemory/1.0"

    async def geocode(self, address: str) -> Optional[Coordinates]:
        """
        Convert address to coordinates.

        Returns None if geocoding fails.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    self.base_url,
                    params={
                        "q": address,
                        "format": "json",
                        "limit": 1
                    },
                    headers={"User-Agent": self.user_agent},
                    timeout=5.0
                )

                if response.status_code == 200:
                    data = response.json()
                    if data and len(data) > 0:
                        result = data[0]
                        return Coordinates(
                            latitude=float(result["lat"]),
                            longitude=float(result["lon"])
                        )

        except Exception as e:
            print(f"Geocoding error: {e}")

        return None

    async def reverse_geocode(self, latitude: float, longitude: float) -> Optional[str]:
        """
        Convert coordinates to address.

        Returns address string or None if reverse geocoding fails.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://nominatim.openstreetmap.org/reverse",
                    params={
                        "lat": latitude,
                        "lon": longitude,
                        "format": "json"
                    },
                    headers={"User-Agent": self.user_agent},
                    timeout=5.0
                )

                if response.status_code == 200:
                    data = response.json()
                    return data.get("display_name")

        except Exception as e:
            print(f"Reverse geocoding error: {e}")

        return None
```

---

### API Implementation

**File:** `packages/api/fidus/memory/routes/location_routes.py`

```python
from fastapi import APIRouter, Depends, HTTPException, Query
from typing import List, Optional
from fidus.memory.entities.location import Location, LocationCreate, LocationUpdate
from fidus.memory.repositories.location_repository import LocationRepository
from fidus.memory.services.geocoding_service import GeocodingService
from fidus.auth import get_current_user, User
from fidus.dependencies import get_neo4j_driver, get_feature_flags
from fidus.config import FeatureFlags

router = APIRouter(prefix="/api/memory/entities/location", tags=["locations"])


@router.post("", response_model=Location, status_code=201)
async def create_location(
    loc_data: LocationCreate,
    geocode: bool = Query(False, description="Auto-geocode address if coordinates missing"),
    current_user: User = Depends(get_current_user),
    neo4j_driver = Depends(get_neo4j_driver),
    flags: FeatureFlags = Depends(get_feature_flags)
):
    """
    Create a new Location entity.

    If geocode=true and coordinates are missing, attempts to geocode the address.
    """
    if not flags.ENABLE_LOCATION_ENTITY:
        raise HTTPException(status_code=404, detail="Location entity not enabled")

    # Auto-geocode if requested and coordinates missing
    if geocode and not loc_data.coordinates and loc_data.address:
        geocoding = GeocodingService()
        coords = await geocoding.geocode(loc_data.address)
        if coords:
            loc_data.coordinates = coords

    repo = LocationRepository(neo4j_driver)
    location = await repo.create(
        tenant_id=current_user.tenant_id,
        user_id=current_user.id,
        loc_data=loc_data
    )
    return location


@router.get("/{location_id}", response_model=Location)
async def get_location(
    location_id: str,
    current_user: User = Depends(get_current_user),
    neo4j_driver = Depends(get_neo4j_driver),
    flags: FeatureFlags = Depends(get_feature_flags)
):
    """Get Location by ID"""
    if not flags.ENABLE_LOCATION_ENTITY:
        raise HTTPException(status_code=404, detail="Location entity not enabled")

    repo = LocationRepository(neo4j_driver)
    location = await repo.get(location_id, current_user.tenant_id)

    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    return location


@router.get("", response_model=List[Location])
async def list_locations(
    user_id: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    neo4j_driver = Depends(get_neo4j_driver),
    flags: FeatureFlags = Depends(get_feature_flags)
):
    """List locations with optional filters"""
    if not flags.ENABLE_LOCATION_ENTITY:
        raise HTTPException(status_code=404, detail="Location entity not enabled")

    target_user_id = user_id or current_user.id

    repo = LocationRepository(neo4j_driver)
    locations = await repo.list_by_user(
        user_id=target_user_id,
        tenant_id=current_user.tenant_id,
        type_filter=type,
        limit=limit,
        offset=offset
    )
    return locations


@router.get("/nearby", response_model=List[dict])
async def get_nearby_locations(
    latitude: float = Query(..., ge=-90, le=90),
    longitude: float = Query(..., ge=-180, le=180),
    radius_km: float = Query(10, ge=0.1, le=100),
    limit: int = Query(20, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    neo4j_driver = Depends(get_neo4j_driver),
    flags: FeatureFlags = Depends(get_feature_flags)
):
    """
    Find locations within radius of given coordinates.

    Returns locations sorted by distance with distance_km field.
    """
    if not flags.ENABLE_LOCATION_ENTITY:
        raise HTTPException(status_code=404, detail="Location entity not enabled")

    repo = LocationRepository(neo4j_driver)
    results = await repo.get_nearby_locations(
        latitude=latitude,
        longitude=longitude,
        radius_km=radius_km,
        tenant_id=current_user.tenant_id,
        limit=limit
    )

    # Format response with distance
    return [
        {
            **location.model_dump(),
            "distance_km": round(distance, 2)
        }
        for location, distance in results
    ]


@router.put("/{location_id}", response_model=Location)
async def update_location(
    location_id: str,
    update_data: LocationUpdate,
    current_user: User = Depends(get_current_user),
    neo4j_driver = Depends(get_neo4j_driver),
    flags: FeatureFlags = Depends(get_feature_flags)
):
    """Update Location"""
    if not flags.ENABLE_LOCATION_ENTITY:
        raise HTTPException(status_code=404, detail="Location entity not enabled")

    repo = LocationRepository(neo4j_driver)
    location = await repo.update(location_id, current_user.tenant_id, update_data)

    if not location:
        raise HTTPException(status_code=404, detail="Location not found")

    return location


@router.delete("/{location_id}", status_code=204)
async def delete_location(
    location_id: str,
    current_user: User = Depends(get_current_user),
    neo4j_driver = Depends(get_neo4j_driver),
    flags: FeatureFlags = Depends(get_feature_flags)
):
    """Delete Location"""
    if not flags.ENABLE_LOCATION_ENTITY:
        raise HTTPException(status_code=404, detail="Location entity not enabled")

    repo = LocationRepository(neo4j_driver)
    deleted = await repo.delete(location_id, current_user.tenant_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Location not found")

    return None
```

---

### Frontend Implementation

**File:** `packages/web/src/components/memory/LocationMap.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Card, Button, Select } from '@fidus/ui';
import { getLocations } from '@/lib/api/memory';
import { Location } from '@/types/memory';
import Link from 'next/link';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export function LocationMap() {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Geolocation error:', error);
          // Default to Berlin if geolocation fails
          setUserLocation([52.5200, 13.4050]);
        }
      );
    } else {
      setUserLocation([52.5200, 13.4050]);
    }
  }, []);

  const { data: locations = [], isLoading } = useQuery({
    queryKey: ['locations', typeFilter === 'all' ? undefined : typeFilter],
    queryFn: () => getLocations({
      type: typeFilter === 'all' ? undefined : typeFilter
    })
  });

  const filteredLocations = locations.filter(loc => loc.coordinates);

  if (!userLocation) {
    return <div>Loading map...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Locations</h2>
        <Link href="/memory/locations/new">
          <Button>Add Location</Button>
        </Link>
      </div>

      <div className="mb-4">
        <Select
          label="Filter by type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-64"
        >
          <option value="all">All Types</option>
          <option value="home">Home</option>
          <option value="work">Work</option>
          <option value="gym">Gym</option>
          <option value="restaurant">Restaurant</option>
          <option value="park">Park</option>
          <option value="store">Store</option>
          <option value="transit">Transit</option>
          <option value="other">Other</option>
        </Select>
      </div>

      <div className="h-[600px] rounded-lg overflow-hidden">
        <MapContainer
          center={userLocation}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {filteredLocations.map(location => (
            <Marker
              key={location.id}
              position={[
                location.coordinates!.latitude,
                location.coordinates!.longitude
              ]}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{location.name}</h3>
                  {location.type && (
                    <p className="text-sm text-gray-600 capitalize">{location.type}</p>
                  )}
                  {location.address && (
                    <p className="text-sm">{location.address}</p>
                  )}
                  <Link href={`/memory/locations/${location.id}`}>
                    <Button size="sm" className="mt-2">View Details</Button>
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        Showing {filteredLocations.length} location(s)
      </div>
    </Card>
  );
}
```

**UI/UX Requirements:**
- Interactive map with OpenStreetMap tiles
- Location markers color-coded by type
- Popup on marker click with basic info
- Filter dropdown to show specific location types
- User's current location as map center
- "Add Location" button in top-right
- Responsive layout (mobile-friendly)
- Accessible keyboard navigation

---

### Testing Requirements

**E2E Test:**

**File:** `packages/web/tests/e2e/memory/location-workflow.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test('User can create and view locations on map', async ({ page }) => {
  // Login
  await page.goto('/login');
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Navigate to locations
  await page.goto('/memory/locations');
  await expect(page.locator('h2')).toContainText('My Locations');

  // Create location
  await page.click('text=Add Location');
  await page.fill('[name="name"]', 'FitX Berlin');
  await page.selectOption('[name="type"]', 'gym');
  await page.fill('[name="address"]', 'Oranienburger Str. 45, Berlin');
  await page.click('button:has-text("Create")');

  // Verify marker appears on map
  await expect(page.locator('.leaflet-marker-pane')).toBeVisible();

  // Click marker
  await page.click('.leaflet-marker-icon');

  // Verify popup
  await expect(page.locator('.leaflet-popup')).toContainText('FitX Berlin');

  // View details
  await page.click('text=View Details');
  await expect(page.locator('h2')).toContainText('FitX Berlin');
});

test('LLM extracts location from conversation', async ({ page }) => {
  await page.goto('/chat');

  await page.fill('[placeholder="Type a message..."]', 'I go to the gym on Main Street every morning');
  await page.click('button[type="submit"]');

  await expect(page.locator('.message')).toContainText('gym');

  await page.goto('/memory/locations');
  await expect(page.locator('.leaflet-marker-pane')).toBeVisible();
});
```

---

## Implementation Guidelines

### Must Follow

1. **⚠️ ARCHITECTURAL EXCEPTION (ADR-0002 Decision 2):**
   - **Location is PRIMARY in Neo4j** (exception from ADR-0001 Qdrant-First pattern)
   - **Reason:** Qdrant lacks native geospatial indexing
   - **Neo4j stores:** ALL location properties (name, address, coordinates, type, amenities)
   - **Qdrant stores:** ONLY visit context (mood, activity, companions, notes)
   - **DO NOT** store location properties in Qdrant
   - **DO NOT** attempt geospatial queries in Qdrant

2. **Geospatial Indexes (CRITICAL):**
   - Create Neo4j point index on `coordinates`
   - Create composite index on `(tenant_id, coordinates)` for tenant-scoped queries
   - Use `point.distance()` for proximity queries
   - Store coordinates as Neo4j Point type
   - Expected performance: <50ms for radius queries on 1M locations

3. **Spatial Query Examples:**
   - **Radius query:** "Find gyms within 2km of current location"
     ```cypher
     MATCH (l:Location {tenant_id: $tenant_id})
     WHERE distance(l.coordinates, point({latitude: $lat, longitude: $lon})) < 2000
     RETURN l ORDER BY distance(l.coordinates, point({latitude: $lat, longitude: $lon}))
     ```
   - **Nearest query:** "Find closest 5 restaurants"
     ```cypher
     MATCH (l:Location {tenant_id: $tenant_id, type: 'restaurant'})
     WHERE l.coordinates IS NOT NULL
     RETURN l ORDER BY distance(l.coordinates, point({latitude: $lat, longitude: $lon}))
     LIMIT 5
     ```

4. **Feature Flag:**
   - All functionality behind `ENABLE_LOCATION_ENTITY`
   - Graceful 404 if flag disabled

5. **Multi-Tenancy:**
   - Filter all queries by `tenant_id`
   - Verify tenant isolation in tests
   - Use composite index (tenant_id, coordinates) for performance

6. **Geocoding:**
   - Optional auto-geocoding for addresses
   - Use Nominatim (free) or Google Maps API
   - Handle geocoding failures gracefully

7. **Map Performance:**
   - Lazy load map library
   - Limit markers displayed (<100)
   - Implement clustering for dense areas

### Must NOT Do

- **Store location properties in Qdrant** (violates ADR-0002 exception pattern)
- **Attempt geospatial queries in Qdrant** (no native spatial indexing)
- Expose geolocation data without user consent
- Store precise home coordinates without privacy consideration
- Skip geospatial indexes (queries will be slow)
- Use synchronous geocoding (will block)

---

## Dependencies & Prerequisites

**Required:**
- Package 1.2 completed (User entity)
- Neo4j 5.x with geospatial support
- Leaflet library installed: `npm install leaflet react-leaflet`

**Technical:**
- Neo4j Point type support
- Haversine distance calculation
- OpenStreetMap tiles (free)

---

## Verification Checklist

### Functionality
- [ ] User can create location with address
- [ ] User can view locations on map
- [ ] User can filter locations by type
- [ ] Nearby locations query works (radius search)
- [ ] LLM extracts locations from conversation
- [ ] Map markers clickable with popups

### Code Quality
- [ ] Geospatial indexes created
- [ ] Type hints complete
- [ ] No linting errors

### Testing
- [ ] Unit tests pass
- [ ] Integration tests pass (geospatial queries)
- [ ] E2E test passes (map interaction)
- [ ] Nearby search tested

### Performance
- [ ] Map loads <2s
- [ ] Geospatial queries <100ms
- [ ] Marker clustering for >50 locations

---

## Success Criteria

This package is **successfully implemented** when:

1. User can view all locations on interactive map
2. User can create/edit/delete locations
3. User can filter locations by type
4. LLM extracts "I go to the gym on Main Street" → creates Location
5. Nearby locations API returns results within radius
6. All tests pass
7. Feature flag toggle works
8. Deployed to dev successfully

---

**Prompt Version:** 1.0
**Generated:** 2025-11-21
**Target Package:** 5.2 - Location Entity with Map UI

---

**END OF IMPLEMENTATION PROMPT**
