# AgriSoko Pocket G14

**Group code:** G14
**Assignment:** INES Ruhengeri COMBO AI/ML - Group Assignment 3
**Repository:** https://github.com/gadniyibigira5/agrisoko-pocket-g14
**Release:** https://github.com/gadniyibigira5/agrisoko-pocket-g14/releases/tag/v1.0.1
**APK:** build/AgriSokoPocket_G14.apk

## Members and roles

| Member | Reg No | Role | GitHub |
|---|---|---|---|
| Niyibigira Gad | 25/26952 | Group Lead + Mobile | @gadniyibigira5 |
| Teta Erssie | - | AI Engineer & issue 1 | @tetaerssie90-svg |
| Mbabazi Sandrine | - | AI Engineer | @mbabazisandrine |
| Joel Mogar Jr Eliezar | - | Mobile | @joelmongarjr |
| Uwiringiyimana Marie Claire | - | Mobile | @claireuwiringiyimana796-create |
| Mohamed Bashir | - | Integration + QA | @uesrnamemohammed |

## Product purpose

AgriSoko Pocket G14 is a deterministic, evidence-grounded AI profile finder. A visitor asks a natural-language question, the AI matches it against 6 approved member records, and returns one profile with confidence, contribution summary, generated introduction, and evidence links. If no member scores above 0.45, the app refuses to guess. It never invents facts.

## Architecture

- mobile/  (React Native + Expo + TypeScript) - 5 screens, light/dark theme, hero image, 6 avatars, real GitHub links on profiles
- ai-api/  (FastAPI + scikit-learn) - TF-IDF matcher, 5 endpoints, deterministic retrieval

## Setup and run

### AI API

    cd ai-api
    python -m pip install -r requirements.txt
    python -m pip install scikit-learn joblib
    python build_index.py
    python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0

### Mobile

    cd mobile
    npm install --legacy-peer-deps
    npx expo start --web --port 8081

Open http://localhost:8081 in Chrome.

## API URL configuration

- Web preview: http://localhost:8000 (default)
- Physical phone LAN demo: http://10.214.240.106:8000 (hardcoded in api.ts)
- Production: change apiBaseUrl in src/lib/api.ts to your deployed URL and rebuild

## EAS build command

    cd mobile
    npx eas-cli build -p android --profile preview --non-interactive

## Tested devices

| Device | OS | Result |
|---|---|---|
| Chrome web preview | Windows 11 | All states work |
| Android phone | Android 12+ | APK installs; live Ask works on same LAN; offline Ask works via bundled directory |

## Final commit hash

Latest on main: see git log --oneline -1

## APK location

- In repo: build/AgriSokoPocket_G14.apk
- In release: https://github.com/gadniyibigira5/agrisoko-pocket-g14/releases/tag/v1.0.1

## Known limitations

1. Lexical retrieval - synonyms don't match; queries should use member vocabulary
2. Threshold 0.45 calibrated on 23-query suite
3. No external LLM - deterministic by design
4. Testers: 4 internal only
5. LAN deployment - production deploy to Render is documented above

## Evidence files

| File | Purpose |
|---|---|
| evidence/TEST_LOG.md + .pdf | 18 member + 5 no-match eval, 100% accuracy |
| evidence/test-log-members.csv | Raw member query results |
| evidence/test-log-nomatch.csv | Raw no-match query results |
| evidence/CONTRIBUTIONS.md + .pdf | Signed contribution map |
| evidence/FEEDBACK.md + .pdf | Tester log + 2 fixed bugs |
| evidence/COMBO_A3_G14_DEMO.mp4 | 3-minute unedited demo |
| evidence/AI_USE.md | AI use disclosure |
| evidence-screens/ | UI screenshots |
| docs/COMBO_A3_G14_REPORT.md + .pdf | 10-page report |
