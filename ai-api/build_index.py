"""build_index.py â€” validate members.json, build TF-IDF index, write fingerprint.

Owner: Mbabazi Sandrine
Branch: feat/ai-index-tests
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

import joblib
from sklearn.feature_extraction.text import TfidfVectorizer

ROOT = Path(__file__).parent
DATA = ROOT / "data" / "members.json"
BUILD = ROOT / "build"
BUILD.mkdir(exist_ok=True)

FORBIDDEN_FIELDS = {"phone", "address", "password", "token", "apiKey", "secret"}
REQUIRED_FIELDS = [
    "fullName", "registrationNumber", "aliases", "githubUsername",
    "role", "skills", "targetUser", "problem", "contribution",
    "feature", "outcomeMetric", "evidenceLinks", "testerFeedback",
    "introductionDraft",
]


def fingerprint(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def doc_text(member: dict) -> str:
    """One searchable document per member. Alias tokens get 3x weight."""
    aliases = " ".join(member.get("aliases") or [])
    name_block = f"{member['fullName']} {aliases} {aliases} {aliases}"
    parts = [
        name_block,
        member.get("role", ""),
        " ".join(member.get("skills") or []),
        member.get("feature", ""),
        member.get("problem", ""),
        member.get("contribution", ""),
        member.get("outcomeMetric") or "",
    ]
    return " ".join(parts).lower()


def validate(payload: dict) -> list[str]:
    errors = []
    members = payload.get("members", [])
    if not (4 <= len(members) <= 6):
        errors.append(f"need 4-6 members, got {len(members)}")
    for m in members:
        missing = [k for k in REQUIRED_FIELDS if k not in m]
        if missing:
            errors.append(f"{m.get('fullName', '?')}: missing {missing}")
        bad = FORBIDDEN_FIELDS & set(m.keys())
        if bad:
            errors.append(f"{m.get('fullName', '?')}: forbidden {bad}")
    return errors


def main() -> int:
    if not DATA.exists():
        print(f"FAIL: {DATA} not found")
        return 1

    payload = json.loads(DATA.read_text(encoding="utf-8-sig"))
    errors = validate(payload)
    if errors:
        for e in errors:
            print("FAIL:", e)
        return 1

    members = payload["members"]
    # Consent guard: strip tester quotes without explicit consent
    for m in members:
        tf = m.get("testerFeedback")
        if tf and not tf.get("consent"):
            m["testerFeedback"] = None

    docs = [doc_text(m) for m in members]
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), sublinear_tf=True, min_df=1)
    X = vectorizer.fit_transform(docs)
    joblib.dump((vectorizer, X, members), BUILD / "index.joblib")

    fp = fingerprint(DATA)
    meta = {
        "groupCode": payload["groupCode"],
        "vectorizer": "TfidfVectorizer(word, ngram=(1,2), sublinear_tf=True)",
        "threshold": 0.45,
        "datasetFingerprint": fp,
        "memberCount": len(members),
        "modelVersion": f"1.0.0-{fp[:8]}",
        "limitations": [
            "Deterministic lexical retrieval; synonyms outside approved docs miss.",
            "Threshold 0.45 calibrated on small evaluation set.",
            "Returns only approved member fields; no generative facts.",
        ],
    }
    (BUILD / "model_meta.json").write_text(json.dumps(meta, indent=2), encoding="utf-8")

    print(f"OK {meta['modelVersion']}  fingerprint={fp[:12]}")
    return 0


if __name__ == "__main__":
    sys.exit(main())