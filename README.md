# SkillForge Learner Frontend · AI-Powered Career Readiness Platform

SkillForge is not an LMS; it does not measure passive course completion. SkillForge answers: **"Does this candidate actually possess the verified skills required for the job they want?"**

---

## 1. Product Soul & Business Rules

### Core Career Loop
`Target Career` → `Skill Gap` → `Roadmap` → `Learn` → `Quiz / Assessment` → `Project (Mentor Review)` → `Certificate` → `Readiness Score` → `Next Recommended Action`

### Enforced Principles
1. **Verified Beats Self-Declared**: Self-declared skills display a `SELF_DECLARED` badge with a dashed border and do not count toward verified competence until tested.
2. **Skill Upgrade Pipeline**: `Course` → `Timed Assessment` → `Capstone Project` → `Mentor Verification`.
3. **Passing Benchmark**: Assessments require $\ge 70\%$ to unlock `ASSESSED` standing.
4. **Peer/Mentor Authority (Rule 4)**: Learners can **never** verify their own projects. Submissions enter the queue as `"Awaiting mentor review"`.
5. **Prerequisite Gating**: Roadmaps enforce architectural dependencies (e.g., Docker cannot be started before foundations; AWS requires containerization).
6. **Weighted Readiness Formula**:
   $$\text{Readiness Score} = \text{Technical Skills (35\%)} + \text{Assessments (25\%)} + \text{Projects (25\%)} + \text{Interview Prep (15\%)}$$
7. **Advisory Tone Only**: Honest, non-promissory tone ("Based on your SkillForge data, you appear ready for junior Python backend roles." No employment guarantees).

---

## 2. Design System: Strict Monochrome

- **Palette**: Black, white, and grays only. Zero blue, purple, green, or red anywhere in the UI.
- **Tokens**:
  - Background: `#FFFFFF` (Dark: `#0A0A0A`)
  - Foreground: `#0A0A0A` (Dark: `#FAFAFA`)
  - Surface: `#FAFAFA` (Dark: `#121212`)
  - Border: `#E5E5E5` (Dark: `#2E2E2E`)
  - Muted Text: `#737373` (Dark: `#A3A3A3`)
- **Semantic State Encoding Without Color**:
  - **Fills & Weights**: Solid black for completed/active, thin outlined for pending, hatched/dashed for locked/self-declared.
  - **Icons**: Paired with explicit textual labels (`CheckCircle2`, `Clock`, `Lock`, `AlertTriangle`).
- **Focus Rings**: Accessible 2px black/white outline with offset.

---

## 3. RBAC Architecture

| Role | Default Home | Primary Permissions | Protected Areas |
| :--- | :--- | :--- | :--- |
| **LEARNER** | `/dashboard` | `projects:submit`, `readiness:view`, `quizzes:take`, `skills:declare` | Learner Dashboard, Roadmap, Assessments, Projects |
| **MENTOR** | `/mentor` | `projects:review`, `projects:verify`, `readiness:view` | Mentor Review Queue & Rubrics |
| **ADMIN** | `/admin` | `content:manage`, `users:manage`, `assessments:manage`, all | Admin Console & Content Management |
| **RECRUITER** | `/recruiter` | `candidates:view`, `readiness:view` | Candidate Pipeline Search |

- Route protection is managed dynamically through `NAV_ITEMS` filtered by role, client guards, and `document.cookie` synchronization.
- Unauthenticated requests redirect to `/login`. Unauthorized role attempts route to `/403`.

---

## 4. Project Directory Layout

```
src/
├── components/
│   ├── auth/              # RoleGate, PermissionGate
│   ├── layout/            # DashboardLayout, Sidebar, TopBar, FloatingMentorLauncher
│   ├── screens/           # Dashboard, Roadmap, Assessments, Projects, AI Mentor, Onboarding, Auth
│   └── shared/            # VerificationBadge, ReadinessBadge, SkillLevelMeter, CircularProgress, Toast
├── constants/
│   ├── rbac.ts            # ROLE_PERMISSIONS, ROLE_HOME, NAV_ITEMS
│   └── readiness.ts       # READINESS_THRESHOLDS, formula weights, advisory disclaimers
├── hooks/
│   ├── useAuth.ts         # User session and RBAC accessors
│   ├── useReadiness.ts    # Scoring formulas and trends
│   ├── useRole.ts         # Role membership checkers
│   └── useTimer.ts        # Timed assessment countdown with persistence
├── lib/
│   ├── api/               # Axios client, interceptors, typed services
│   ├── mocks/             # Domain dataset (Rahul Sharma, Python Backend Developer)
│   └── utils.ts           # Classnames & Tailwind merge
├── stores/
│   ├── authStore.ts       # Zustand store with persistence & RBAC helpers
│   └── mentorStore.ts     # Shared state for full-page chat and floating widget
└── types/                 # Strict TypeScript domain models & API envelopes
```

---

## 5. Environment Variables & Setup

Create a `.env` file from `.env.example`:
```bash
# FastAPI Backend URL
NEXT_PUBLIC_API_URL="http://localhost:8000"
VITE_API_URL="http://localhost:8000"

# Mock Adapter Toggle (true = offline mock data mode for standalone UI)
NEXT_PUBLIC_USE_MOCKS="true"
VITE_USE_MOCKS="true"
```

### Development Commands
```bash
npm install        # Install dependencies
npm run dev        # Launch Vite development server on port 3000
npm run lint       # Typecheck codebase (tsc --noEmit)
npm run build      # Build production bundle
```

---

## 6. Verification & Test Checklist

- [x] **Strict Monochrome**: All views rendered exclusively in `#0A0A0A`, `#FFFFFF`, and grayscale tones.
- [x] **Verification Badges**: 4 distinct geometry/border treatments (Self-Declared, Assessed, Project-Verified, Verified).
- [x] **Readiness Formula**: 35% Technical + 25% Assessments + 25% Projects + 15% Interview Prep.
- [x] **Business Rule 4**: Learner submissions enter `UNDER_REVIEW`; learners cannot self-verify.
- [x] **Prerequisites**: Roadmap phase 8 and 9 display explicit dependency locking rules.
- [x] **Assessment Runtime**: Persistent countdown timer with low-time warning and local answer caching.
- [x] **Floating AI Mentor**: Shared Zustand store accessible from every dashboard screen and full-page `/ai-mentor`.
