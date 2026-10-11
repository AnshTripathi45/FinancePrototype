"""
FastAPI Server for 'Finding the Next Signal' Prototype (Track C: Consumer, FMCG & Retail).
Exposes autonomous investigation APIs and serves the interactive UI dashboard & research report.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import sys

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.agents.orchestrator import ResearchOrchestrator

app = FastAPI(
    title="Finding the Next Signal - Autonomous Financial Research Agent (Track C)",
    description="Autonomous research agent for NIFTY 50 Consumer, FMCG & Retail uncovering non-obvious, auditable discoveries.",
    version="1.0.0"
)

# Enable CORS for local development flexibility
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = ResearchOrchestrator()


class InvestigationRequest(BaseModel):
    ticker: str


@app.get("/api/companies")
def get_companies():
    """Returns the list of indexed Track C NIFTY 50 companies and peers."""
    return {
        "track": "Track C — Consumer, FMCG & Retail",
        "companies": orchestrator.get_available_companies()
    }


@app.post("/api/investigate")
def run_investigation(req: InvestigationRequest):
    """
    Triggers the autonomous investigation workflow:
    Discover -> Connect -> Calculate -> Reason -> Challenge/Falsify -> Prove.
    """
    ticker = req.ticker.strip().upper()
    if not ticker:
        raise HTTPException(status_code=400, detail="Ticker symbol must not be empty.")
    
    try:
        result = orchestrator.run_investigation(ticker)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/quick-demo/{ticker}")
def quick_demo(ticker: str):
    """Convenience endpoint to quickly fetch an analysis by ticker."""
    try:
        return orchestrator.run_investigation(ticker)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Mount the frontend directory as static files
frontend_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
