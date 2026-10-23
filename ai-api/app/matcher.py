"""TF-IDF matcher with alias boost, feature boost, and grounded responses."""
from __future__ import annotations

import json
import re
from pathlib import Path

import joblib
from sklearn.metrics.pairwise import cosine_similarity

BUILD = Path(__file__).parent.parent / "build"
THRESHOLD = 0.45
ALIAS_BOOST = 0.40
FEATURE_BOOST = 0.40
STOPWORDS = {
    "who", "is", "the", "a", "an", "tell", "me", "about",
    "made", "did", "what", "does", "was", "of",
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
        q = f" {cleaned_query} "
        hits = {}
        for i, m in enumerate(self.members):
            names = [m["fullName"]] + list(m.get("aliases") or [])
            for n in names:
                token = self.normalize(n)
                if not token:
                    continue
                if re.search(rf"(?:^|\s){re.escape(token)}(?:\s|$)", q):
                    hits[i] = max(hits.get(i, 0.0), ALIAS_BOOST)
                    break
        return hits

    def _feature_hits(self, cleaned_query: str) -> dict[int, float]:
        hits = {}
        query_words = set(cleaned_query.split())
        if not query_words:
            return hits
        for i, m in enumerate(self.members):
            feature = self.normalize(m.get("feature") or "")
            contribution = self.normalize(m.get("contribution") or "")
            feature_words = (set(feature.split()) | set(contribution.split())) - STOPWORDS
            overlap = query_words & feature_words
            if overlap:
                hits[i] = max(hits.get(i, 0.0), FEATURE_BOOST)
        return hits

    def ask(self, question: str) -> dict:
        q_full = self.normalize(question)
        tokens = [t for t in q_full.split() if t not in STOPWORDS]
        if not tokens:
            return self._no_match([], "Question contained no searchable terms.")

        cleaned_query = " ".join(tokens)
        qv = self.vectorizer.transform([cleaned_query])
        sims = cosine_similarity(qv, self.matrix)[0].astype(float)

        boosts = self._alias_hits(cleaned_query)
        for idx, boost in boosts.items():
            sims[idx] = min(1.0, sims[idx] + boost)

        feature_boosts = self._feature_hits(cleaned_query)
        for idx, boost in feature_boosts.items():
            if idx not in boosts:
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
        elif best_idx in feature_boosts:
            reason = "Feature word match + " + reason

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
            base = re.sub(r"\s*[\u2014\u2013-]\s*.*$", ".", base).strip()
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