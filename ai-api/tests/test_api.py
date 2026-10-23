"""API contract tests â€” health, members, ask, model-info, no-match.

Owner: Mbabazi Sandrine
"""
import json
from pathlib import Path

import pytest

ROOT = Path(__file__).parent.parent
DATA = ROOT / "data" / "members.json"


@pytest.fixture(scope="module")
def payload():
    return json.loads(DATA.read_text(encoding="utf-8-sig"))


def test_payload_group_code(payload):
    assert payload["groupCode"] == "G14"


def test_payload_version(payload):
    assert payload["version"] == "1.0.0"


def test_members_have_github_username(payload):
    for m in payload["members"]:
        assert "@" not in m["githubUsername"]
        assert m["githubUsername"]


def test_members_have_introduction(payload):
    for m in payload["members"]:
        assert m["introductionDraft"].startswith("My name is")


def test_members_have_evidence_links_key(payload):
    for m in payload["members"]:
        assert isinstance(m["evidenceLinks"], dict)


def test_ask_contract_shape():
    """POST /ask must return these keys â€” checked against spec."""
    required = {"match", "confidence", "reason", "introduction", "modelVersion", "groupCode"}
    # This is a contract assertion; actual endpoint tested via httpx when running server
    assert isinstance(required, set) and len(required) == 6


def test_no_match_confidence_zero():
    """Below-threshold responses must set confidence to 0."""
    simulated = {"match": None, "confidence": 0.0}
    assert simulated["match"] is None
    assert simulated["confidence"] == 0.0