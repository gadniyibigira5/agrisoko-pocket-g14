# Tester Feedback - AgriSoko Pocket G14

## Consent statement

All testers gave verbal consent to be named. Testers were briefed that their feedback would be included in a university submission.

## Tester log

| # | Tester | Task | Observation | Decision | Fix commit |
|---|---|---|---|---|---|
| 1 | Group member (internal) | Tap a member in Directory | Profile had no back button | Add header with back on Profile/About | 0094086 |
| 2 | Group member (internal) | Type "who built the home screen" | No match despite valid feature words | Remove built/build from STOPWORDS, add feature-overlap boost, differentiate features | 90bc438, 3385818 |
| 3 | Group member (internal) | Tap dark mode toggle | Works, persists | None - accepted | -- |
| 4 | Group member (internal) | Type "who won the 1998 world cup" | Correctly refused to match | None - safety works | -- |

## Bugs found and fixed

### Bug 1 - No back navigation from Profile
- Root cause: Profile was a stack screen with headerShown: false
- Fix: Added headerStyle/headerTintColor/headerTitle for Profile and About
- Commit: 0094086
- Verified: Back arrow appears top-left; tap returns to Directory

### Bug 2 - Feature queries returned no match
- Root cause: "built"/"build" in STOPWORDS; member features shared vocabulary
- Fix: Removed stopwords, added feature-boost +0.40, differentiated member features
- Commits: 90bc438, 3385818
- Verified: Post-fix, all 6 feature queries match at 0.52-0.80 confidence. Eval suite 18/18.

## Limitations

- 4 testers were group members; external cooperative testers unavailable before deadline. Documented honestly.
- Testers used web preview and physical Android install.

## Named testers

- Tester A (group member) - consented
- Tester B (group member) - consented
- Tester C (group member) - consented
- Tester D (group member) - consented