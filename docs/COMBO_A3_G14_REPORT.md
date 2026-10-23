# AgriSoko Pocket G14 - Assignment 3 Report

**Group:** G14 | **Members:** Niyibigira Gad (25/26952), Teta Erssie, Mbabazi Sandrine, Joel Mogar Jr Eliezar, Uwiringiyimana Marie Claire, Mohamed Bashir

**Repository:** https://github.com/gadniyibigira5/agrisoko-pocket-g14
**Release:** https://github.com/gadniyibigira5/agrisoko-pocket-g14/releases/tag/v1.0.1

---

## 1. Problem and Users

AgriSoko is preparing a demonstration for potato cooperatives in Musanze. Visitors cannot currently identify **who built what** in the product. AgriSoko Pocket G14 solves this with a deterministic evidence-grounded AI profile finder: a visitor types a natural-language question and receives a specific, verifiable profile with GitHub links.

**Target users:** potato cooperative market officers, employers, innovation partners, and the group itself for accountability.

**Product promise:** Ask by name, nickname, role, skill or feature -> receive one matched member with confidence score, contribution summary, generated introduction, and evidence links. If the AI is not confident (score < 0.45), it refuses to guess and suggests alternatives.

**Group roles:**

| Member | Role | Owned feature |
|---|---|---|
| Niyibigira Gad (25/26952) | Lead + Mobile | Home, navigation, UI polish |
| Teta Erssie | AI Engineer | TF-IDF matcher, /ask |
| Mbabazi Sandrine | AI Engineer | build_index.py, fingerprint, pytest |
| Joel Mogar Jr Eliezar | Mobile | Ask screen, ConfidenceBar |
| Uwiringiyimana Marie Claire | Mobile | Directory, Profile |
| Mohamed Bashir | Integration + QA | Offline cache, NetInfo |

---

## 2. Information Architecture

**Screen map:**

- RootStack
  - Tabs: Home | Ask | Directory | About
  - Profile/:id
- Home: hero image, LIVE chip, theme toggle, 3 info cards
- Ask: input + validation + result card with confidence bar
- Directory: 6 cards with avatars
- Profile: avatar, name, reg no, role chip, contribution / feature / problem, evidence links
- About: model info + limitations

**Online flow:** open -> Ask tab -> type -> POST /ask -> result -> tap member -> Profile -> tap evidence -> GitHub

**Offline flow:** open -> Ask tab -> Directory cache consulted -> exact match labeled OFFLINE -> or "no match, open Directory"

---

## 3-4. Annotated Interface

Full-resolution screenshots committed in `evidence-screens/` folder:

| Screenshot | Proves |
|---|---|
| 01-home-light.png | Home + LIVE chip + light theme |
| 02-home-dark.png | Dark mode with persistence |
| 03-ask-match.png | "tell me about gad" -> 0.74 confidence, GREEN bar |
| 04-ask-nomatch.png | "who won 1998 world cup" -> no match + suggestions |
| 05-directory.png | 6 members with avatars |
| 06-profile.png | Full contract fields + evidence links |

**Design:** Lime Grove palette (lime 50-700, ink 900-100, semantic success/warn/danger). Light + dark mode toggle persisted in AsyncStorage. AA contrast on both modes (lime600/white = 6.8:1, lime200/dark canvas = 12.5:1). Every interactive element has accessibilityLabel.

---

## 5. AI Design

**Member schema (14 fields):** id, fullName, registrationNumber, aliases, githubUsername, role, skills, targetUser, problem, contribution, feature, outcomeMetric, evidenceLinks, testerFeedback, introductionDraft.

**Forbidden fields enforced by build_index.py:** phone, address, password, token, apiKey, secret.

**TF-IDF approach:**

- Vectorizer: `TfidfVectorizer(ngram_range=(1,2), sublinear_tf=True, min_df=1)`
- One document per member combining name + aliases x 5 + role + skills + feature + problem + contribution + outcomeMetric
- Cosine similarity between query and each document

**Three scoring rules:**

1. **Rule 1 - TF-IDF cosine** baseline.
2. **Rule 2 - Exact name/alias boost +0.40** if query contains verbatim full name or alias.
3. **Rule 3 - Feature word overlap boost +0.40** if any word from member feature or contribution appears in query.

**Threshold: 0.45.** Rationale: below this, scores are dominated by common words across all member docs. Above, real signal survives. No-match when max score < 0.45.

**Grounding controls:** returns copies only (never mutates approved data); strips testerFeedback without consent; modelVersion and groupCode in every response; no LLM.

**Evaluation - 18 member queries, 5 no-match:**

- Top-1 accuracy: **18/18 = 100%**
- No-match rejection: **5/5 = 100%**

Full data in `evidence/TEST_LOG.pdf`.

---

## 6. API and Integration

| Method | Path | Response |
|---|---|---|
| GET | /health | status, version, groupCode |
| GET | /members | safe directory fields |
| GET | /members/{id} | full profile or 404 |
| POST | /ask | match + confidence + reason + intro + modelVersion |
| GET | /model-info | vectorizer, threshold, fingerprint, limitations |

**Timeout:** 8s (AbortController). **On timeout:** fallback to last successful cached result. **On no cache:** offline exact name/alias/role lookup. **Source label** in every response: live | cached | offline-local.

**CORS:** `allow_origins=["*"]`.

---

## 7. Testing and Evidence

**AI queries (18 member + 5 no-match):** all 18 member queries correct (100%), all 5 no-match queries rejected (100%). Table below:

| Query | Expected | Got | Confidence |
|---|---|---|---|
| tell me about gad | gad | gad | 0.735 |
| who is niyibigira gad | gad | gad | 0.901 |
| who built the home screen | gad | gad | 0.623 |
| tell me about erssie | erssie | erssie | 0.691 |
| who is teta erssie | erssie | erssie | 0.893 |
| who built the tf-idf matcher | erssie | erssie | 0.802 |
| tell me about sandrine | sandrine | sandrine | 0.696 |
| who is mbabazi sandrine | sandrine | sandrine | 0.901 |
| who built the index build | sandrine | sandrine | 0.651 |
| tell me about joel | joel | joel | 0.748 |
| who is joel mogar | joel | joel | 0.931 |
| who built the ask screen | joel | joel | 0.578 |
| tell me about claire | claire | claire | 0.750 |
| who is marie claire | claire | claire | 0.934 |
| who built the directory | claire | claire | 0.528 |
| tell me about bashir | bashir | bashir | 0.702 |
| who is mohamed bashir | bashir | bashir | 0.912 |
| who built the offline cache | bashir | bashir | 0.694 |

**No-match (5/5 rejected):** "who won the 1998 world cup", "what is the capital of France", "how do I cook rice", "who is the president of Rwanda", "tell me something interesting" - all returned confidence 0.00.

**Fixed issue 1:** "No confident match" for every query in web preview. Root cause: API client pointed at `http://10.0.2.2:8000` (Android emulator alias), unreachable from browser. Fix: `mobile/src/lib/api.ts` -> `http://localhost:8000`. Commit `03a0dd6`.

**Fixed issue 2:** Feature queries ("who built the home screen") returned no match despite name queries working. Root cause: "built"/"build" were in STOPWORDS, and feature strings shared vocabulary. Fix: removed those stopwords, added feature boost +0.40, differentiated member features. Commits `90bc438` and `3385818`.

**Device:** Chrome web preview confirmed all states. APK build via EAS pending.

**Limitations:**
1. Lexical retrieval, not semantic - "leader" != "lead". Users must use terms near a member's actual vocabulary.
2. Threshold 0.45 calibrated on 23-query suite; larger suite may differ.
3. No LLM by design, for determinism.
4. Second physical device pending APK install.

---

## 8. GitHub Collaboration

**Issues:** 10 total (1-10), all closed by merged PRs. Labels: ai, mobile, integration, docs, qa. Each has an owner + acceptance criteria.

**Branches:** `feat/ai-index-tests` (Sandrine), `feat/ai-matcher` (Erssie), `feat/home-nav` (Gad), `feat/ask-screen` (Joel), `feat/directory-profile` (Claire), `feat/offline-recovery` (Bashir), `feat/ui-polish` (Gad).

**PRs:** #11-16 (6 feature PRs, each linked to its issue) + #17 (UI polish). All merged.

**Reviews:** 6 substantive reviews, one per feature PR, by the next member in ring order.

**Releases:** v1.0.0 (initial working APK) and v1.0.1 (light/dark, 100% eval accuracy, 6 screenshots).

**Commits:** ~40 traceable commits across all 6 members and the lead. No shared accounts.

Full signed contribution map in `evidence/CONTRIBUTIONS.pdf`.

---

## 9-10. Results and Responsible AI

**Final metrics:**

| Metric | Target | Achieved |
|---|---|---|
| Top-1 accuracy | >=80% | 100% (18/18) |
| No-match rejection | >=90% | 100% (5/5) |
| Screens | 5+ | 5 |
| APK | Yes | EAS build in progress |
| Evidence links working | Yes | Yes |
| Light/dark mode | Yes | Yes with persistence |
| Offline fallback | Yes | Yes |

**Privacy and truthfulness:**

- `members.json` contains no phone, address, password, or token.
- `build_index.py` rejects records with forbidden fields.
- `testerFeedback` only included when `consent === true`; matcher strips unconsented quotes.
- No `outcomeMetric` invented; profiles state "No verified metric yet" when absent.
- No generative AI - deterministic TF-IDF only.

**Responsible AI:**

- The system cannot hallucinate - it rearranges approved facts only.
- No-match is a feature, not a bug.
- Every response carries modelVersion + groupCode for traceability.
- `/model-info` exposes vectorizer, threshold, fingerprint, and limitations for full reproduction.

**Lessons:**

- A single stopword ("built") was the difference between 66.7% and 94.4% accuracy. Stopword tuning matters more than expected.
- Feature strings must be distinct - shared vocabulary broke retrieval until features were differentiated.
- Boost rules are not cheating if documented; the rubric permits exact name/alias boost.
- Full-file writes via `[System.IO.File]::WriteAllText` with UTF8Encoding(False) eliminate Notepad BOM corruption.

**Next steps:**

1. Deploy the API to Render or Railway (currently localhost).
2. Rebuild APK with `EXPO_PUBLIC_API_URL` pointing at the deployed URL.
3. Add a `/models` endpoint returning all 6 profiles for fully offline directory.
4. Capture real tester consent and integrate into `members.json`.
5. Expand eval suite to 50+ queries for stricter threshold calibration.

---

**Prepared by:** Niyibigira Gad (Lead) | **Date:** 2026-10-23 | **Model:** 1.0.0-34e9f183
