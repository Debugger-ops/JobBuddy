# 🎯 JobBuddy — Your Smart Job Search Companion

> Track every application, follow-up, and offer in one elegant workspace. Built for serious job seekers.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Chrome Extension](#chrome-extension)
- [Database Schema](#database-schema)
- [Pages & Routes](#pages--routes)
- [Scripts](#scripts)

---

## Overview

JobBuddy is a full-stack job application tracker that helps you manage your entire job search from one place. Log applications, track interview stages, analyze your funnel, and auto-capture jobs from LinkedIn, Naukri, and Internshala using the built-in Chrome extension.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Dashboard** | Overview of all applications with status breakdown |
| **Job Board** | Full list view with filter, sort, update, and delete |
| **Analytics** | Funnel charts — applied → interview → offer conversion |
| **Profile** | Quick-fill form with resume upload and cover letter template |
| **Add Job** | Manual job entry with title, company, location, salary, deadline |
| **Chrome Extension** | Auto-capture jobs from LinkedIn, Naukri, Internshala, Indeed, Glassdoor |
| **Auth** | Email/password + Google OAuth via Supabase |
| **Auto-sync** | Extension token syncs automatically when you log in |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, shadcn/ui, custom CSS |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Routing | React Router v6 |
| State | React Query (TanStack) |
| Extension | Chrome Manifest V3 |
| Testing | Vitest, Playwright |

---

## 📁 Project Structure

```
job-buddy/
├── src/
│   ├── pages/
│   │   ├── LandingPage.tsx       # Public marketing page (/)
│   │   ├── LandingPage.css       # White & blue theme
│   │   ├── AuthPage.tsx          # Login / signup (/auth)
│   │   ├── Index.tsx             # Dashboard shell (/dashboard)
│   │   └── NotFound.tsx          # 404 page
│   │
│   ├── components/
│   │   ├── AppSidebar.tsx        # Navigation sidebar
│   │   ├── DashBoardView.tsx     # Dashboard overview
│   │   ├── JobsListView.tsx      # Jobs table + filters
│   │   ├── AddJobView.tsx        # Add new job form
│   │   ├── AnalyticsView.tsx     # Charts & funnel stats
│   │   ├── ProfileView.tsx       # User profile & resume
│   │   └── ui/                   # shadcn/ui components
│   │
│   ├── hooks/
│   │   ├── useAuth.ts            # Supabase auth state
│   │   ├── useJobTracker.ts      # Jobs + profile CRUD
│   │   └── useExtensionSync.ts   # Syncs token to Chrome extension
│   │
│   ├── integrations/
│   │   ├── supabase/client.ts    # Supabase client setup
│   │   └── supabase/types.ts     # Generated DB types
│   │
│   ├── styles/                   # Component-level CSS files
│   ├── lib/types.ts              # Shared TypeScript types
│   └── App.tsx                   # Root router + providers
│
├── trackr-extension/             # Chrome extension
│   ├── manifest.json             # Extension config (MV3)
│   ├── content.js                # Scrapes job pages
│   ├── background.js             # Saves jobs to Supabase
│   ├── popup.html                # Extension popup UI
│   ├── popup.js                  # Popup logic
│   └── icons/                    # Extension icons (16/48/128px)
│
├── supabase/
│   └── migrations/               # Database migrations
│
├── public/
│   └── favicon.svg
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Supabase](https://supabase.com) account (free tier works)

### 1. Clone and install

```bash
git clone https://github.com/your-username/job-buddy.git
cd job-buddy
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your Supabase credentials (see [Environment Variables](#environment-variables)).

### 3. Run the app

```bash
npm run dev
```

App runs at **http://localhost:8080**

---

## 🔑 Environment Variables

Create a `.env` file at the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in your Supabase project → **Settings → API**.

---

## 🧩 Chrome Extension

The extension auto-captures jobs from supported job sites and saves them directly to your JobBuddy dashboard.

### Install

1. Open Chrome → go to `chrome://extensions`
2. Enable **Developer mode** (top-right toggle)
3. Click **Load unpacked**
4. Select the `trackr-extension/` folder
5. Pin the 🎯 JobBuddy icon to your toolbar

### Connect your account

Log in to JobBuddy at `localhost:8080` — the `useExtensionSync` hook automatically writes your Supabase session token to the extension. The popup will show **● Connected**.

### Supported sites

| Site | Save Button | Auto-detect Apply |
|---|---|---|
| LinkedIn | ✅ | ✅ Easy Apply |
| Naukri | ✅ | — |
| Internshala | ✅ | — |
| Indeed | ✅ | — |
| Glassdoor | ✅ | — |

### How to use

- **Floating button** — A blue "Save to JobBuddy" button appears at the bottom-right of every job listing. Click to save instantly.
- **Popup** — Click the toolbar icon to preview the detected job, pick a status, and save.
- **LinkedIn auto-save** — Clicking Easy Apply automatically saves the job as "Applied" with no extra steps.

---

## 🗄 Database Schema

The app uses the following Supabase tables:

### `jobs`

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| user_id | uuid | FK → auth.users |
| title | text | Job title |
| company | text | Company name |
| location | text | City / Remote |
| url | text | Job listing URL |
| salary | text | Salary range |
| status | text | saved / applied / interview / offer / rejected |
| notes | text | Personal notes |
| deadline | date | Application deadline |
| created_at | timestamp | Auto-set |

### `profiles`

| Column | Type | Description |
|---|---|---|
| id | uuid | FK → auth.users |
| full_name | text | User's full name |
| email | text | Contact email |
| phone | text | Phone number |
| linkedin_url | text | LinkedIn profile |
| skills | text[] | Array of skills |
| experience | text | Work experience summary |
| education | text | Education background |
| cover_letter_template | text | Reusable cover letter |
| resume_url | text | Uploaded resume URL |

---

## 🛣 Pages & Routes

| Route | Component | Access |
|---|---|---|
| `/` | `LandingPage` | Public — always visible |
| `/auth` | `AuthPage` | Guests only — logged-in users redirected to `/dashboard` |
| `/dashboard` | `Index` | Protected — guests redirected to `/auth` |
| `*` | `NotFound` | Public |

### Auth flow

```
/ (landing)
  ├── Not logged in → click CTA → /auth → login → /dashboard
  └── Logged in → nav shows "Dashboard" button → /dashboard

/auth
  └── Already logged in → auto-redirect → /dashboard

/dashboard
  └── Not logged in → auto-redirect → /auth
```

---

## 📜 Scripts

```bash
# Development
npm run dev          # Start dev server at localhost:8080

# Build
npm run build        # Production build → dist/

# Preview
npm run preview      # Preview production build locally

# Type check
npm run type-check   # Run TypeScript compiler check

# Tests
npm run test         # Run Vitest unit tests
npm run test:e2e     # Run Playwright end-to-end tests
```

---

## 🔄 Extension Development

After making changes to any file inside `trackr-extension/`:

1. Go to `chrome://extensions`
2. Click the **↻ refresh** icon on the JobBuddy extension card
3. Reload the job site tab

To update the production URL (when deploying):

```js
// trackr-extension/background.js — line 4
const TRACKR_APP_URL = 'https://your-production-domain.com';

// trackr-extension/popup.js — update both chrome.tabs.create URLs
```

---

## 📄 License

MIT — free to use, modify, and distribute.

---

Built with ❤️ for job seekers everywhere.
