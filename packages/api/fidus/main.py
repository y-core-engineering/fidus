from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fidus.api.routes import memory

app = FastAPI(title="Fidus Memory API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(memory.router)


@app.get("/health")
async def health():
    return {"status": "ok"}
