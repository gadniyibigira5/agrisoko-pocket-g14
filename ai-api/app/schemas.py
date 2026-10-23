"""Pydantic models for the AgriSoko Pocket API contract.

Owner: Teta Erssie
"""
from __future__ import annotations

from typing import Any

from pydantic import BaseModel, Field


class AskIn(BaseModel):
    question: str = Field(..., min_length=2, max_length=300)


class EvidenceLinks(BaseModel):
    issue: str = ""
    pr: str = ""
    commit: str = ""
    demoTimestamp: str = ""


class MemberOut(BaseModel):
    id: str
    fullName: str
    registrationNumber: str
    aliases: list[str]
    githubUsername: str
    role: str
    skills: list[str]
    targetUser: str
    problem: str
    contribution: str
    feature: str
    outcomeMetric: str | None = None
    evidenceLinks: EvidenceLinks
    testerFeedback: dict | None = None
    introductionDraft: str


class AskOut(BaseModel):
    match: MemberOut | None
    confidence: float
    reason: str
    introduction: str | None
    suggestions: list[str] | None = None
    modelVersion: str
    groupCode: str


class HealthOut(BaseModel):
    status: str
    version: str
    groupCode: str


class ModelInfoOut(BaseModel):
    groupCode: str
    vectorizer: str
    threshold: float
    datasetFingerprint: str
    modelVersion: str
    limitations: list[str]