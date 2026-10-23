"""FastAPI application â€” the full AgriSoko Pocket API contract.

Owner: Teta Erssie
Endpoints:
  GET  /health
  GET  /members
  GET  /members/{id}
  POST /ask
  GET  /model-info
"""
from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .matcher import Matcher
from .schemas import AskIn, AskOut, HealthOut, ModelInfoOut

app = FastAPI(title="AgriSoko Pocket API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

M = Matcher()
MEMBERS = M.members
META = M.meta


@app.get("/health", response_model=HealthOut)
def health() -> dict:
    return {"status": "ok", "version": "1.0.0", "groupCode": META["groupCode"]}


@app.get("/members")
def list_members() -> list[dict]:
    safe = ("id", "fullName", "role", "skills", "feature", "githubUsername")
    return [{k: m.get(k) for k in safe} for m in MEMBERS]


@app.get("/members/{member_id}")
def get_member(member_id: str) -> dict:
    for m in MEMBERS:
        if m["id"] == member_id:
            return m
    raise HTTPException(status_code=404, detail=f"Member '{member_id}' not found")


@app.post("/ask", response_model=AskOut)
def ask(body: AskIn) -> dict:
    if not body.question.strip():
        raise HTTPException(status_code=400, detail="Empty question")
    return M.ask(body.question)


@app.get("/model-info", response_model=ModelInfoOut)
def model_info() -> dict:
    keys = ("groupCode", "vectorizer", "threshold", "datasetFingerprint",
            "modelVersion", "limitations")
    return {k: META[k] for k in keys}