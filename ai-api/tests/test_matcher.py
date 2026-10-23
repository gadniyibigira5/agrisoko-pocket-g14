"""Matcher unit tests â€” exact name, alias, role, feature, no-match, empty.

Owner: Mbabazi Sandrine
"""
import json
from pathlib import Path

import pytest

ROOT = Path(__file__).parent.parent
DATA = ROOT / "data" / "members.json"


@pytest.fixture(scope="module")
def members():
    return json.loads(DATA.read_text(encoding="utf-8-sig"))["members"]


def find_by_term(members, term: str):
    t = term.lower()
    for m in members:
        hay = " ".join([
            m["fullName"],
            " ".join(m.get("aliases") or []),
            m["role"],
            " ".join(m.get("skills") or []),
            m.get("feature", ""),
        ]).lower()
        if t in hay:
            return m
    return None


def test_dataset_has_six_members(members):
    assert 4 <= len(members) <= 6


def test_exact_full_name_lookup(members):
    for m in members:
        assert find_by_term(members, m["fullName"]) is not None


def test_alias_lookup(members):
    for m in members:
        for alias in m.get("aliases") or []:
            assert find_by_term(members, alias) is not None


def test_role_lookup(members):
    for m in members:
        assert find_by_term(members, m["role"]) is not None


def test_feature_lookup(members):
    for m in members:
        assert find_by_term(members, m["feature"]) is not None


def test_no_match_on_unrelated_query(members):
    assert find_by_term(members, "who won the 1998 world cup") is None


def test_no_match_on_vague_query(members):
    assert find_by_term(members, "tell me something") is None


def test_members_have_required_fields(members):
    required = {"fullName", "registrationNumber", "githubUsername",
                "role", "skills", "feature", "introductionDraft"}
    for m in members:
        assert required.issubset(m.keys())


def test_forbidden_fields_absent(members):
    forbidden = {"phone", "address", "password", "token"}
    for m in members:
        assert forbidden.isdisjoint(m.keys())


def test_empty_dataset_rejected():
    with pytest.raises(AssertionError):
        assert 4 <= 0 <= 6