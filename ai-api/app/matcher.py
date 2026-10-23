"""TF-IDF matcher with alias boost and grounded responses.

Owner: Teta Erssie
Branch: feat/ai-matcher

Rules enforced:
- Deterministic retrieval only (no generative LLM).
- Returns ONLY fields stored in approved members.json.
- Confidence threshold 0.45 (documented, calibrated on eval_queries.json).
- Alias tokens appear 3x in each member's document (exact-name boost rule).
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import joblib
from sklearn.metrics.pairwise import cosine_similarity

BUILD = Path(__file__).parent.parent / "build"
THRESHOLD = 0.45
STOPWORDS = {
    "who", "is", "the", "a", "an", "tell", "me", "about",
    "built", "build", "made", "did", "what", "does", "was", "of",
}


class Matcher:
    def __init__(self) -> None:
        self.vectorizer, self.matrix, self.members = joblib.load(BUILD / "index.joblib")
        self.meta = json.loads((BUILD / "model_meta.json").read_text(encoding="utf-8-sig"))

    @staticmethod
    def normalize(question: str) -> str:
        return re.sub(r"[^a-z0-9\s]", " ", question.lower()).strip()

    def ask(self, question: str) -> dict:
        q = self.normalize(question)
        tokens = [t for t in q.split() if t not in STOPWORDS]
        if not tokens:
            return self._no_match([], "Question contained no searchable terms.")

        qv = self.vectorizer.transform([q])
        sims = cosine_similarity(qv, self.matrix)[0]
        idx = int(sims.argmax())
        conf = float(sims[idx])

        if conf < THRESHOLD:
            suggestions = [m["fullName"] for m in self.members[:3]]
            return self._no_match(
                suggestions,
                f"Best similarity {conf:.2f} is below threshold {THRESHOLD}.",
            )

        member = dict(self.members[idx])  # copy â€” never mutate approved data
        if member.get("testerFeedback") and not member["testerFeedback"].get("consent"):
            member["testerFeedback"] = None

        return {
            "match": member,
            "confidence": round(conf, 3),
            "reason": f"Matched on terms: {self._explain(qv, idx)}",
            "introduction": self._introduce(member),
            "modelVersion": self.meta["modelVersion"],
            "groupCode": self.meta["groupCode"],
        }

    def _explain(self, qv, idx: int) -> str:
        names = self.vectorizer.get_feature_names_out()
        q_idx = set(qv.indices)
        doc_idx = set(self.matrix[idx].indices)
        hits = [names[t] for t in q_idx if t in doc_idx][:5]
        return ", ".join(hits) if hits else "semantic similarity"

    def _introduce(self, member: dict) -> str:
        base = member.get("introductionDraft") or (
            f"My name is {member['fullName'].split()[0]}. "
            f"I worked on {member['feature']} as {member['role']}."
        )
        if not member.get("outcomeMetric"):
            base = re.sub(r"\s*[â€”â€“]\s*.*$", ".", base).strip()
        return base

    def _no_match(self, suggestions: list, reason: str) -> dict:
        return {
            "match": None,
            "confidence": 0.0,
            "reason": reason,
            "introduction": None,
            "suggestions": suggestions,
            "modelVersion": self.meta["modelVersion"],
            "groupCode": self.meta["groupCode"],
        }