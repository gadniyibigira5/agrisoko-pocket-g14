# TEST_LOG - AgriSoko Pocket G14

Generated: 2026-10-23 11:45:55
API: http://localhost:8000
Model version: 1.0.0-765cc783
Threshold: 0.45

## Summary

| Metric | Value |
|---|---|
| Member queries | 18 |
| Top-1 correct | 14 / 18 |
| Top-1 accuracy | 77.8% |
| No-match queries | 5 |
| No-match correctly rejected | 5 / 5 |
| No-match rejection rate | 100% |

## Member queries (3 per member)

| # | Query | Category | Expected | Got | Confidence | Result |
|---|---|---|---|---|---|---|
| 1 | tell me about gad | name | gad | gad | 0.737 | OK |
| 2 | who is niyibigira gad | name | gad | gad | 0.904 | OK |
| 3 | who built the home screen | feature | gad | gad | 0.625 | OK |
| 4 | tell me about erssie | name | erssie | erssie | 0.714 | OK |
| 5 | who is teta erssie | name | erssie | erssie | 0.932 | OK |
| 6 | who built the tf-idf matcher | feature | erssie | NONE | 0.0 | MISS |
| 7 | tell me about sandrine | name | sandrine | sandrine | 0.719 | OK |
| 8 | who is mbabazi sandrine | name | sandrine | sandrine | 0.94 | OK |
| 9 | who built the index build | feature | sandrine | NONE | 0.0 | MISS |
| 10 | tell me about joel | name | joel | joel | 0.745 | OK |
| 11 | who is joel mogar | name | joel | joel | 0.927 | OK |
| 12 | who built the ask screen | feature | joel | joel | 0.631 | OK |
| 13 | tell me about claire | name | claire | claire | 0.754 | OK |
| 14 | who is marie claire | name | claire | claire | 0.94 | OK |
| 15 | who built the directory | feature | claire | NONE | 0.0 | MISS |
| 16 | tell me about bashir | name | bashir | bashir | 0.714 | OK |
| 17 | who is mohamed bashir | name | bashir | bashir | 0.931 | OK |
| 18 | who built the offline cache | feature | bashir | NONE | 0.0 | MISS |

## No-match queries (should all return null)

| # | Query | Confidence | Result |
|---|---|---|---|
| 1 | who won the 1998 world cup | 0.0 | PASS |
| 2 | what is the capital of France | 0.0 | PASS |
| 3 | how do I cook rice | 0.0 | PASS |
| 4 | who is the president of Rwanda | 0.0 | PASS |
| 5 | tell me something interesting | 0.0 | PASS |

## Error analysis
The following queries returned the wrong member or no match:
- who built the tf-idf matcher
- who built the index build
- who built the directory
- who built the offline cache

## Method

- TF-IDF vectorizer: word n-grams (1,2), sublinear TF, min_df=1
- Cosine similarity between query vector and each member document
- Alias boost: +0.40 if query contains exact full name or alias
- Stopwords stripped from query before vectorization (who, is, the, tell, me, about, built, etc.)
- Threshold: 0.45 (documented rationale: member docs are ~80 tokens; single-keyword queries with pure cosine score ~0.27-0.34, below threshold. Alias boost pushes exact-name queries to 0.7+. Feature queries rely on shared vocabulary with differentiated feature strings.)

## Known limitations

- Word-based TF-IDF does not bridge synonyms ("leader" != "lead", "made" != "built").
- Feature queries perform best when they use exact terms from the member feature field.
- No semantic embeddings - this is by design (deterministic, offline, grounded).
