"""TF-IDF matcher with alias boost and grounded responses.

Owner: Teta Erssie
Branch: feat/ai-matcher
Rules enforced:
- Deterministic retrieval only (no generative LLM).
- Returns ONLY fields stored in approved members.json.
- Confidence threshold 0.45 (documented in report).
- Stopwords are stripped BEFORE vectorization so noise words do not dilute TF-IDF.
- Exact name/alias boost: +0.40 to the member whose name/alias appears verbatim in the query.
  This rule exists because single-token queries over long documents score below 0.45 with pure
  TF-IDF cosine. Documented in the report under "name/alias boost".
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import joblib
from sklearn.metrics.pairwise import cosine_similarity

BUILD = Path(__file__).parent.parent / "build"
THRESHOLD = 0.45
ALIAS_BOOST = 0.40
STOPWORDS = {
    "who", "is", "the", "a", "an", "tell", "me", "about",
    "built", "build", "made", "did", "what", "does", "was", "of",
    "and", "or", "to", "for", "in", "on", "at", "by", "with",
}


class Matcher:
    def __init__(self) -> None:
        self.vectorizer, self.matrix, self.members = joblib.load(BUILD / "index.joblib")
        self.meta = json.loads((BUILD / "model_meta.json").read_text(encoding="utf-8-sig"))

    @staticmethod
    def normalize(text: str) -> str:
        return re.sub(r"[^a-z0-9\s]", " ", text.lower()).strip()

    def _alias_hits(self, cleaned_query: str) -> dict[int, float]:
        """Return {member_index: boost} for members whose alias/full name appears in the query."""
        q = f" {cleaned_query} "
        hits = {}
        for i, m in enumerate(self.members):
            names = [m["fullName"]] + list(m.get("aliases") or [])
            for n in names:
                # word-boundary match: "gad" matches " gad " but not "gadget"
                token = self.normalize(n)
                if not token:
                    continue
                if re.search(rf"(?:^|\s){re.escape(token)}(?:\s|$)", q):
                    hits[i] = max(hits.get(i, 0.0), ALIAS_BOOST)
                    break
        return hits

    def ask(self, question: str) -> dict:
        q_full = self.normalize(question)
        tokens = [t for t in q_full.split() if t not in STOPWORDS]
        if not tokens:
            return self._no_match([], "Question contained no searchable terms.")

        cleaned_query = " ".join(tokens)

        # Rule 1: TF-IDF cosine similarity
        qv = self.vectorizer.transform([cleaned_query])
        sims = cosine_similarity(qv, self.matrix)[0].astype(float)

        # Rule 2: exact name/alias boost
        boosts = self._alias_hits(cleaned_query)
        for idx, boost in boosts.items():
            sims[idx] = min(1.0, sims[idx] + boost)

        best_idx = int(sims.argmax())
        best_score = float(sims[best_idx])

        if best_score < THRESHOLD:
            suggestions = [m["fullName"] for m in self.members[:3]]
            return self._no_match(
                suggestions,
                f"Best similarity {best_score:.2f} is below threshold {THRESHOLD}.",
            )

        member = dict(self.members[best_idx])
        if member.get("testerFeedback") and not member["testerFeedback"].get("consent"):
            member["testerFeedback"] = None

        reason = f"Matched on terms: {self._explain(qv, best_idx)}"
        if best_idx in boosts:
            reason = "Exact name/alias match + " + reason

        return {
            "match": member,
            "confidence": round(best_score, 3),
            "reason": reason,
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
            base = re.sub(r"\s*[—–-]\s*.*$", ".", base).strip()
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