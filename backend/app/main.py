"""FastAPI application entry point."""

from app.api.issues import router as issue_router
from app.api.upload import router as upload_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings

# Create the FastAPI application instance.
# title, description, and version show up in the auto-generated docs at /docs.
app = FastAPI(
    title=settings.app_name,
    description="AI-powered Community Intelligence Platform API",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.include_router(issue_router)
app.include_router(upload_router)
# CORS lets the Next.js frontend (running on port 3000) call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root() -> dict[str, str]:
    """Root endpoint — confirms the backend is up."""
    return {"message": "Community Hero Backend Running"}


@app.get("/health")
def health_check() -> dict[str, str]:
    """Health check used by deployment platforms and monitoring tools."""
    return {"status": "healthy"}
