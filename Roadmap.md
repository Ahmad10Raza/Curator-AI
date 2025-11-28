Nice idea, this is actually powerful if you design it like a “personal OS for learning tech”.

I’ll break it into:

* Product vision
* User types & main journeys
* Feature roadmap (Phase 0 → Phase 3)
* AI/LLM ideas
* Notification & automation ideas
* Rough data model (high level)
* Tech/implementation suggestions

You can copy-paste this into your own product doc later.

## 1. Product vision

**learning-tech-with-orchestrate**
A full-stack platform where:

* All tech topics (languages, tools, frameworks, cloud, devops, AI, RPA, etc.) are organized in one place.
* Each user builds their **personal learning workspace**:

  * Learning roadmap
  * Notes & code snippets
  * Daily learning log
  * LLM-powered explanations, quizzes, project ideas
* At the end of the day, an **AI “Orchestrator”** sends:

  * Summary of what they learned
  * Weak areas + suggestions for next steps
    via email / WhatsApp / in-app notifications.

Think “Notion + LeetCode + ChatGPT + Learning Tracker” specifically for tech.

## 2. User types & key journeys

### User roles

1. **Learner**

   * Student / fresher / experienced dev learning new tools.
2. **Mentor / Instructor** (later phases)

   * Creates curated paths, reviews learner progress.
3. **Admin**

   * Manages tech catalog, topics, content, moderation.

### Main learner journeys

1. **Onboarding**

   * Choose experience level: Beginner / Intermediate / Advanced.
   * Choose interests: Web dev, Data science, AI/ML, RPA, DevOps, Cloud, etc.
   * System generates a **personal roadmap** with milestones.

2. **Daily learning session**

   * Open “Today’s Plan”.
   * Read/watch content or learn from your own imported notes.
   * Ask LLM questions while learning.
   * Take notes, save code snippets, mark topics as “understood / confused”.

3. **End of day**

   * User clicks “End Today’s Learning” (or auto-detect inactivity).
   * LLM:

     * Summarizes notes + questions + links studied.
     * Generates “Today’s learning summary”.
     * Sends via email / WhatsApp.
     * Updates streak, XP points, badges.

4. **Review & revision**

   * User sees dashboard: what they learned last week, weak topics.

   * System generates micro-quizzes / flashcards for revision.

   * Shows long-term “Learning Journal” timeline.

## 3. Roadmap of features (by phases)

### Phase 0 – Foundation (MVP skeleton)

Goal: A minimal but functional version: sign up, topics catalog, personal notes, basic daily logs, simple email summary.

**0.1. Auth & basic profiles**

* Email/password login (later OAuth: Google/GitHub).
* Basic profile: name, role (student/professional), primary interest.
* Timezone (important for “today” summary).

**0.2. Tech Catalog**

* Structured list of **Tech Domains**:

  * Programming languages (Python, JS, C++, etc.)
  * Web (HTML/CSS/React/Node)
  * AI/ML
  * Data Engineering
  * RPA (UiPath, AA, Power Automate)
  * DevOps (Docker, Kubernetes, CI/CD)
  * Databases, Cloud, etc.
* For each tech:

  * Short description.
  * Difficulty tags.
  * Prerequisites.

**0.3. Personal Learning Board**

* User can:

  * Search tech and add to “My Stack”.
  * Create **learning goals**: “Learn React basics in 14 days”.
  * Mark status: “Not started / In progress / Completed”.

**0.4. Notes & Learning Logs**

* Per topic:

  * Rich text notes (headings, bullet points, code blocks).
  * Tags (e.g., “interview”, “project”).
* Daily log:

  * Auto-group notes by date.
  * User can add quick entries: “Today I watched video X, built feature Y”.

**0.5. Basic Email Summary (no LLM yet or minimal)**

* At 11 PM local time:

  * Backend job collects:

    * Topics touched today
    * New notes created
    * Time spent (approx from timestamps)
  * Generates a simple text summary and emails user:

    * “You studied 3 topics today: X, Y, Z…”

That’s your **very first shippable product**.

### Phase 1 – LLM-powered learning experience

Goal: Make the platform “smart” and helpful, not just a static notes app.

**1.1. LLM Learning Assistant (per topic)**

* In each topic page, a chat panel:

  * “Explain this concept in simple words.”
  * “Give me example code in Python / JS.”
  * “Generate 5 MCQs for today’s topic.”
* Assistant has context of:

  * User level (beginner/intermediate)
  * User notes (optional, with consent)

**1.2. Smart Note Enhancer**

* Inside note editor:

  * Button: “Summarize this note”
  * “Convert my messy notes into structured headings”
  * “Add real-world examples to this note”
  * “Generate flashcards from my notes”

**1.3. AI Daily Summary (better version)**

* At day end:

  * LLM reads:

    * Today’s notes
    * Topics marked completed
    * Questions asked in chat
  * Generates:

    * A short summary
    * Key concepts learned
    * Weak areas detected (e.g., user asked many questions about joins in SQL)
    * Suggestion: “Tomorrow, revise SQL joins + practice 3 problems.”

* Summary sent via:

  * Email
  * In-app “Timeline” page

**1.4. Learning Streak & Gamification**

* Basic gamification:

  * Daily streak count.
  * XP points for:

    * Completing a topic.
    * Writing notes.
    * Taking quizzes.
  * Simple badges:

    * “7-day streak learner”

    * “React Explorer” (completed x% of React path).

### Phase 2 – Deep features for serious learners

Goal: Make it a proper “learning OS” that tracks skills, connects content, and helps with placements.

**2.1. Structured Learning Paths**

* Pre-defined paths made by you (or mentors), for example:

  * “MERN Stack Developer Roadmap”
  * “Data Scientist Roadmap”
  * “RPA Developer (UiPath + AA + Power Automate)”
  * “DevOps Engineer Roadmap”
* Each path:

  * Ordered list of topics.
  * Progress bar.
  * Prerequisite check (user can mark existing knowledge).

**2.2. Skill Graph / Knowledge Map**

* Visual graph of:

  * Skills the user has started / completed.
  * Dependencies: “To learn Kafka, you should know basic Python + Linux”.
* AI suggestion:

  * “You are learning Deep Learning. Consider learning Linear Algebra basics first.”

**2.3. Quizzes & Spaced Repetition**

* System:

  * Generates MCQs from topics and from user notes using LLM.
  * Tracks which questions the user got wrong.
  * Re-schedules them using spaced repetition (e.g., after 1 day, 3 days, 7 days).
* “Daily quiz” card on dashboard:

  * “Answer 10 questions based on what you learned this week.”

**2.4. Project Ideas & Portfolio Builder**

* For each tech:

  * AI-suggested project ideas with difficulty levels.
* User can:

  * Create “Project entries” with:

    * Description
    * GitHub link
    * Tech used
    * Screenshots
  * This acts as a **public portfolio page** they can share.

**2.5. Resume & Job Mapping (AI)**

* User uploads or fills:

  * Skills they know.
  * Experience.
* LLM:

  * Maps their learning progress to resume bullet points.
  * Suggests what to learn next for:

    * “Data Scientist role”

    * “Backend Developer role”

    * “RPA Developer role”

### Phase 3 – Collaboration, mentors, and integrations

Goal: Turn it into a community / ecosystem.

**3.1. Mentor / Instructor Accounts**

* Mentors can:

  * Create and publish learning paths.
  * Share curated reading lists.
  * See anonymized stats of learners (optional).
* Learners can:

  * “Follow” a mentor.
  * Enroll in a mentor’s path.

**3.2. Study Groups & Rooms**

* Group learning:

  * Create “Cohorts” (e.g., “Python Batch October”).
  * Shared chat/forum.
  * Shared leaderboard.

**3.3. Integrations**

* GitHub:

  * Auto-import repositories as projects in portfolio.
* Google Drive / OneDrive:

  * Attach files to notes.
* Calendar:

  * Add learning sessions to Google Calendar.

**3.4. Notifications to WhatsApp / Telegram**

* Using official APIs:

  * Send:

    * Daily learning summary
    * Reminders: “Your streak is about to break!”
  * Quick buttons:

    * “Start today’s plan”
    * “Take daily quiz”

**3.5. Marketplace (very advanced)**

* Paid premium:

  * Advanced AI analytics of your learning.
  * Mentor-led paid courses.
* Earn credits by:

  * Contributing good learning paths.

  * Solving community doubts.

## 4. AI / LLM use-cases (detailed list)

List of AI features you can implement gradually:

1. **Explain & simplify**

   * Explain any concept at different levels:

     * “Explain indexing in databases like I’m 12”
     * “Explain React hooks with code examples”

2. **Code helper**

   * Generate code snippets.
   * Debug user’s code.
   * Suggest refactoring & best practices.

3. **Note assistant**

   * Clean up free-form notes → structured sections.
   * Translate notes.
   * Generate flashcards & MCQs.

4. **Learning coach**

   * Analyze weekly activity.
   * Recommend:

     * “Focus more on X”
     * “You are neglecting your data structures goal”

5. **Content generator for your platform**

   * Auto-generate:

     * Topic descriptions.
     * Prerequisite lists.
     * Sample interview questions.

6. **Roadmap generator**

   * User types:

     * “I want to become a Data Engineer in 6 months.”
   * LLM builds:

     * Month-wise goals.

     * Topics to cover.

     * Suggested practice tasks.

## 5. Notification & automation ideas (where your RPA mindset helps)

You can design orchestrations like:

* **Nightly Learning Orchestrator**

  * Cron job at fixed time:

    * Fetch user activity of the day.
    * Summarize via LLM.
    * Send via:

      * Email
      * WhatsApp (if configured)
      * Push notification

* **Reminder bots**

  * If user hasn’t logged in for 2 days:

    * “You’ve paused your React learning. Want to continue from where you left?”
  * Weekly progress report summary.

* **Milestone triggers**

  * When user completes a roadmap or crosses 30-day streak:

    * Send special congratulation email + certificate (simple PDF).

## 6. Rough data model (high-level entities)

You don’t need full DB design now, but this helps:

* `User`

  * id, name, email, password_hash
  * role (learner/mentor/admin)
  * timezone, interests, level

* `TechTopic`

  * id, name, category, description, difficulty
  * prerequisites (self-relations)

* `LearningPath`

  * id, title, description
  * created_by (user/mentor)

* `LearningPathStep`

  * path_id, topic_id, order_index

* `UserTopic`

  * user_id, topic_id
  * status (not_started/in_progress/completed)
  * progress_percent

* `Note`

  * id, user_id, topic_id, content, created_at

* `DailyLog`

  * id, user_id, date
  * summary_text (optional)
  * time_spent_minutes

* `QuizQuestion`, `UserAnswer`

* `Project`

  * user_id, title, description, tech_stack, github_link

* `NotificationPreference`

  * user_id, email_enabled, whatsapp_enabled, time_of_day

This is enough to start designing tables & APIs.

## 7. Tech stack & implementation order (optional but useful)

Given your background (MERN, RPA, ML), a possible stack:

* **Frontend**:

  * React / Next.js (for SEO + SSR).
  * UI: Tailwind + a component library (ShadCN / MUI).

* **Backend**:

  * Node.js + Express / NestJS
  * REST or GraphQL API
  * Background jobs (BullMQ / simple cron jobs) for summaries.

* **Database**:

  * PostgreSQL / MongoDB (both fine; Postgres is nice for relational structure).

* **AI integration**:

  * OpenAI / other LLM APIs.
  * Keep prompts + responses stored for analytics.

* **Auth**:

  * JWT based auth or NextAuth (if Next.js).

* **Email**:

  * Any transactional email service (SendGrid, Mailgun, etc.).

* **WhatsApp**:

  * Official WhatsApp Cloud API later (Phase 3).

Implementation order:

1. Phase 0 core (auth + topics + notes + simple email).

2. Phase 1 LLM assistant + AI summary.

3. Phase 2 paths, quizzes, portfolio.

4. Phase 3 mentors, groups, integrations.

If you want, next step I can do:

* A very detailed Phase 0 → Phase 1 technical breakdown (APIs, pages, components)
  or
* Detailed flow for “AI Daily Summary” (data pipeline + prompt design).





# Phase 1
Alright, let’s design Phase 1 properly like a real-world product, not just a toy.

I’ll do:

1. Tech stack (2025-relevant, opinionated)
2. What exactly Phase 1 prototype must include
3. High-level architecture (with Mermaid)
4. Folder structure (frontend + backend + infra)
5. Step-by-step build roadmap for Phase 1

You can literally follow this as a checklist.

  

## 1. Tech stack (chosen for 2025 job market + your growth)

**Frontend & Backend (Fullstack)**  
- **Framework:** Next.js (App Router, latest LTS)
- **Language:** TypeScript (everywhere)
- **UI:** React + Tailwind CSS + shadcn/ui  
- **State / data fetching:** React Server Components + React Query (if needed on client)  
- **Forms:** React Hook Form + Zod

**Backend & API layer**  
- **Runtime:** Node.js (via Next.js API routes / server actions)  
- **ORM:** Prisma  
- **Database:** PostgreSQL (Managed: Supabase/Neon/Railway/etc.)  
- **Background jobs:** Simple cron (via external scheduler like GitHub Actions / Railway cron) or a small worker using `node-cron` for now.

**Auth**  
- **NextAuth (Auth.js)** with:
  - Email/password (for prototype)
  - Google / GitHub OAuth (later)

**AI / LLM**  
- **OpenAI API** (e.g., GPT-4.1-mini / 4.1) for:
  - Learning assistant chat
  - Smart note enhancer
  - AI daily summary

**Notifications (Phase 1 prototype)**  
- **Email:** Resend / SendGrid / similar (pick Resend for simplicity)

This stack is:
- Currently in demand (Next.js + TypeScript + Prisma + Postgres is a strong combo).
- Great for portfolio + jobs (full stack / AI / product).
- Simple to deploy on platforms like Vercel (web) + Railway/Neon (DB).

  

## 2. Scope of Phase 1 Prototype

For **Phase 1 prototype**, we combine minimal Phase 0 + the core AI features.

Core parts to implement now:

1. **Auth + basic profile**
   - Sign up / login
   - Store timezone & interests

2. **Tech topics & personal learning board**
   - Browse topics (hardcoded seed data first).
   - Add/remove to “My Stack”.
   - Mark topic status: Not started / In progress / Completed.

3. **Notes & learning logs**
   - Per-topic notes with rich text (simple Markdown editor first).
   - Daily logs auto-created when notes are added.

4. **LLM learning assistant**
   - Chat on each topic page with context:
     - User level
     - Topic info
   - Basic system prompt to make responses structured and simple.

5. **Note enhancer with AI**
   - Button in note editor: “Summarize” / “Improve structure”.

6. **AI daily summary (email)**
   - Cron job once per day (user’s timezone approximated).
   - Collect today’s notes + topics.
   - Call OpenAI to generate summary.
   - Send email.

That’s enough for a strong, demo-able prototype.

  

## 3. Architecture (Mermaid diagram)

Here’s a high-level architecture diagram in Mermaid:

```mermaid
flowchart LR
    subgraph Client["Client (Browser)"]
        UI[Next.js React UI]
        ChatUI[LLM Chat UI]
        NotesUI[Notes Editor]
        BoardUI[Learning Board]
    end

    subgraph NextApp["Next.js App (Server)"]
        APIAuth[/Auth Routes (NextAuth)/]
        APITopics[/Topics API/]
        APINotes[/Notes API/]
        APIChat[/LLM Chat API/]
        APISummary[/Daily Summary API/]
        PrismaClient[(Prisma ORM)]
    end

    subgraph DB["PostgreSQL Database"]
        Users[(users)]
        Profiles[(profiles)]
        Topics[(tech_topics)]
        UserTopics[(user_topics)]
        Notes[(notes)]
        DailyLogs[(daily_logs)]
        Summaries[(daily_summaries)]
    end

    subgraph AI["OpenAI API"]
        ChatModel[(LLM - Chat & Notes)]
        SummaryModel[(LLM - Daily Summary)]
    end

    subgraph Worker["Background Worker / Cron"]
        SummaryJob[Daily Summary Job]
        EmailService[(Email Provider)]
    end

    Client -->|HTTP / HTTPS| NextApp
    NextApp --> PrismaClient
    PrismaClient --> DB

    ChatUI -->|POST /api/chat| APIChat
    APIChat --> AI
    NotesUI -->|POST /api/notes| APINotes
    APINotes --> Notes
    BoardUI -->|GET/POST /api/topics| APITopics
    APITopics --> Topics
    APIAuth --> Users & Profiles

    SummaryJob -->|Fetch today's data| APISummary
    APISummary --> AI
    APISummary --> Summaries
    SummaryJob --> EmailService
```

  

## 4. Folder structure (for Phase 1 prototype)

Assume **Next.js App Router** with monorepo-style structure (but single app).

### Root structure

```bash
learning-tech-with-orchestrate/
├─ .env.local                 # API keys, DB URL, etc.
├─ package.json
├─ next.config.mjs
├─ tsconfig.json
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/            # auto-generated by Prisma migrate
├─ src/
│  ├─ app/                   # Next.js App Router routes
│  ├─ lib/                   # shared utilities
│  ├─ server/                # server-side logic
│  ├─ components/            # reusable React components
│  ├─ styles/                # global styles
│  └─ types/                 # TypeScript types
└─ scripts/                  # cron/worker scripts (Phase 1)
```

### `src/app/` structure (routes)

```bash
src/app/
├─ layout.tsx
├─ page.tsx                          # Landing / marketing page
├─ api/
│  ├─ auth/[...nextauth]/route.ts    # NextAuth routes
│  ├─ topics/
│  │  ├─ route.ts                    # GET (list/create topics)
│  │  └─ [id]/route.ts               # GET/PUT/DELETE topic
│  ├─ user-topics/
│  │  ├─ route.ts                    # POST: add to My Stack
│  │  └─ [id]/route.ts               # PATCH: update status
│  ├─ notes/
│  │  ├─ route.ts                    # POST: create note
│  │  └─ [id]/route.ts               # GET/PATCH/DELETE note
│  ├─ chat/route.ts                  # POST: LLM chat
│  ├─ notes-enhance/route.ts         # POST: enhance/summarize note
│  └─ summary/generate/route.ts      # POST: generate daily summary for a user
├─ dashboard/
│  ├─ page.tsx                       # main dashboard (My Stack + recent notes)
├─ topics/
│  ├─ page.tsx                       # browse all topics
│  └─ [topicId]/
│      ├─ page.tsx                   # topic detail + notes + chat
├─ notes/
│  └─ page.tsx                       # all notes list
└─ settings/
   └─ page.tsx                       # profile + timezone + preferences
```

### `src/components/` structure

```bash
src/components/
├─ layout/
│  ├─ Navbar.tsx
│  ├─ Sidebar.tsx
│  └─ Shell.tsx                     # main layout shell
├─ ui/                              # shadcn components (button, card, etc.)
├─ topics/
│  ├─ TopicCard.tsx
│  └─ TopicList.tsx
├─ board/
│  ├─ MyStackBoard.tsx
├─ notes/
│  ├─ NoteEditor.tsx                # markdown editor
│  ├─ NoteCard.tsx
│  └─ NotesList.tsx
├─ chat/
│  ├─ ChatPanel.tsx                 # chat UI inside topic page
│  └─ MessageBubble.tsx
├─ summary/
│  └─ TodaySummaryCard.tsx
└─ forms/
   └─ ProfileForm.tsx
```

### `src/server/` structure

```bash
src/server/
├─ db.ts                              # Prisma client setup
├─ auth/
│  └─ auth-options.ts                 # NextAuth config
├─ services/
│  ├─ topics-service.ts               # CRUD & business logic
│  ├─ notes-service.ts
│  ├─ user-topics-service.ts
│  ├─ summary-service.ts              # building data for daily summary
│  └─ chat-service.ts                 # wrapper around OpenAI chat
├─ ai/
│  ├─ openai-client.ts                # OpenAI API wrapper
│  ├─ prompts/
│  │  ├─ learning-assistant.ts        # system prompts for topic chat
│  │  ├─ note-enhancer.ts             # system prompt for notes
│  │  └─ daily-summary.ts             # system prompt for summaries
└─ email/
   └─ email-client.ts                 # Resend / SendGrid client
```

### `scripts/` (for cron / background jobs)

```bash
scripts/
├─ generate-daily-summaries.ts        # Node script triggered by cron
└─ test-summary.ts                    # local test runner
```

This script will:
- Query DB for all active users with email enabled.
- For each user, call `/api/summary/generate` or directly use `summary-service.ts`.
- Send email via `email-client.ts`.

  

## 5. Detailed Phase 1 Build Roadmap (step-by-step)

You can treat each bullet as a mini-task or GitHub issue.

### Step 1 – Project bootstrapping

1. Initialize Next.js + TypeScript project.
2. Install core dependencies:
   - `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `@prisma/client`, `prisma`, `next-auth`, `zod`, `@tanstack/react-query` (optional), `axios` or just `fetch`.
3. Setup Tailwind and shadcn/ui.
4. Create basic layout: Navbar, Shell, simple landing page.

  

### Step 2 – Database & Prisma schema

Design initial `schema.prisma` with tables:

- `User` (NextAuth default)
- `Profile`
- `TechTopic`
- `UserTopic`
- `Note`
- `DailyLog`
- `DailySummary` (optional now, nice to have)

Example high-level structure (not full code, just concepts):

- `TechTopic`
  - id, name, category, description, difficulty

- `UserTopic`
  - id, userId, topicId, status, progressPercent

- `Note`
  - id, userId, topicId, content, createdAt

- `DailyLog`
  - id, userId, date, noteCount, topicsTouched

Run:
- `npx prisma migrate dev`
- `npx prisma studio` to check.

Seed topics with a `prisma/seed.ts`:
- Basic topics: “JavaScript Basics”, “React Fundamentals”, “Node.js Basics”, “RPA – Automation Anywhere”, etc.

  

### Step 3 – Auth & Profile

1. Configure NextAuth:
   - Email/password provider for now (credentials provider).
2. Add middleware to protect `/dashboard`, `/topics/[id]`, `/notes`, `/settings`.
3. Profile page:
   - Fields: `displayName`, `timezone`, `experienceLevel` (enum), `interests` (simple string list for now).
4. Save profile in `Profile` table.

  

### Step 4 – Topics & Learning Board

**Backend:**
- Implement `topics-service.ts`:
  - `getAllTopics()`
  - `getTopicById(id)`
- Implement `user-topics-service.ts`:
  - `getUserStack(userId)`
  - `addTopicToUser(userId, topicId)`
  - `updateUserTopicStatus(userTopicId, status)`

**API routes:**
- `/api/topics`:
  - GET: list topics
- `/api/topics/[id]`:
  - GET: topic detail
- `/api/user-topics`:
  - POST: add to My Stack
- `/api/user-topics/[id]`:
  - PATCH: update status

**Frontend:**
- `Topics` page: grid of `TopicCard`.
- Topic detail page:
  - Show description, difficulty, prerequisites (if any).
  - Button: “Add to My Stack”.
- Dashboard:
  - Show “My Stack” grouped by status.

  

### Step 5 – Notes & Daily Logs

**Backend:**
- `notes-service.ts`:
  - `createNote(userId, topicId, content)`
  - `getNotesForTopic(userId, topicId)`
  - `getRecentNotes(userId)`
- Auto-manage `DailyLog`:
  - When `createNote` is called:
    - Upsert `DailyLog` for today (date, userId).
    - Increment noteCount, topicsTouched.

**API routes:**
- `/api/notes`:
  - POST: create note
- `/api/notes/[id]`:
  - GET, PATCH, DELETE (later)

**Frontend:**
- `NoteEditor` on topic page:
  - Simple textarea or Markdown editor.
  - Buttons: Save, Enhance (AI).
- `NotesList` on topic page & `/notes` page.
- Dashboard: show last 3 notes.

  

### Step 6 – LLM Learning Assistant (per topic)

**Backend:**
- `ai/openai-client.ts`:
  - A single function `callOpenAI({ systemPrompt, messages })`.
- `ai/prompts/learning-assistant.ts`:
  - System prompt that tells the model:
    - You are a tech learning assistant.
    - You know the user’s level and this topic.
    - You should respond with examples, structure, and progressive difficulty.

- `chat-service.ts`:
  - `getTopicChatResponse(user, topic, messages)`:
    - Build system prompt with:
      - Topic name, description.
      - User level.
    - Call OpenAI.
    - Return response.

**API:**
- `/api/chat`:
  - POST: `{ topicId, messages }`
  - Response: `{ assistantMessage }`

**Frontend:**
- `ChatPanel` component inside topic page:
  - Shows messages, has input box.
  - On submit, calls `/api/chat`.
  - Renders streaming later (optional, start with full response).

  

### Step 7 – Note Enhancer with AI

**Backend:**
- `ai/prompts/note-enhancer.ts`:
  - System prompt to:
    - Clean up notes.
    - Structure headings.
    - Keep same language but improve clarity.
- API `/api/notes-enhance`:
  - POST: `{ content, mode }` where mode ∈ ["summarize", "structure"].

**Frontend:**
- `NoteEditor`:
  - Button: “Summarize Note”.
  - Sends current content to `/api/notes-enhance`.
  - Updates editor with improved version or shows summary in sidebar.

  

### Step 8 – AI Daily Summary (Phase 1 prototype)

**Backend:**
- `summary-service.ts`:
  - `getTodayLearningData(userId)`:
    - Pull today’s `DailyLog`, notes, user topics touched.
  - `generateDailySummary(user, data)`:
    - Build a prompt:
      - Include bullet points of topics and short excerpts of notes.
    - Call OpenAI using `daily-summary` prompt.
  - Return structured summary:
    - `summaryText`, `topics`, `suggestedNextSteps`.

- `/api/summary/generate`:
  - POST: `{ userId, date? }`
  - For internal use (by cron script).

**Email:**
- `email-client.ts`:
  - `sendDailySummaryEmail(user, summary)`.

**Cron script:**
- `scripts/generate-daily-summaries.ts`:
  - Connect to DB.
  - Get all users with daily email enabled.
  - For each:
    - Call `summary-service` → `email-client`.
  - Can be triggered via:
    - GitHub Actions schedule
    - Railway / Render cron
    - Local cron for dev.

For Phase 1 prototype, you can:
- Hard-code time like 11 PM IST for yourself.
- Later support per-user timezone.

  

### Step 9 – UI polish & small features

- Add loading states and error toasts.
- Add basic analytics on dashboard:
  - “Days active this week”
  - “Topics studied today”
- Save conversation history per topic (Phase 1.5 maybe).

  

If you want, next we can:
- Design the **Prisma schema.prisma** in detail for all these entities.
- Or design the **exact prompt templates** for:
  - Learning assistant
  - Note enhancer
  - Daily summary