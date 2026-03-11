# RecruitRW — Smart Recruitment Platform (Frontend)

A modern, full-stack recruitment application built with **Next.js 14 App Router**, **TypeScript**, and **Tailwind CSS**. Features a polished UI with role-based access control, multi-step application forms, NID/NESA simulation, and rich analytics dashboards.

---

## ✨ Features

| Role | Capabilities |
|------|-------------|
| **Applicant** | Register, submit multi-step application with NID + NESA verification, track status |
| **HR Manager** | View latest 10 applicants (alphabetical), review details, approve/reject with reason |
| **Super Admin** | Full user CRUD, analytics dashboard, all applicant data |

### Key Technical Features
- 🔐 JWT authentication with auto-refresh
- 📋 Multi-step form (NID API → NESA API → Details → Review)
- 📊 Recharts analytics dashboard (area, pie, bar charts)
- 🎨 Design system with Sora + DM Sans fonts, custom color tokens
- 🧩 Repository Pattern for all API calls
- 🗂 Zustand persisted auth store
- ⚡ TanStack Query v5 for server state
- 🧪 72 unit tests (utils, validators, components)
- 📱 Fully responsive with collapsible sidebar

---

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/             # Login, Register
│   └── (dashboard)/        # Protected pages
│       ├── applicant/      # Apply + Status tracking
│       ├── hr/             # Applicants list + detail + review
│       ├── admin/          # User management + analytics
│       └── dashboard/      # HR/Admin dashboard
├── components/
│   ├── ui/                 # Button, Input, Modal, Toast, Badge, Skeleton…
│   ├── forms/              # ApplicationForm (multi-step)
│   ├── layout/             # Sidebar, Header, Providers
│   ├── dashboard/          # Stats cards, Recharts components
│   └── applicants/         # RecentApplicationsTable
├── hooks/                  # useAuth, useApplications, useUsers
├── lib/
│   ├── api/                # Repository pattern (auth, applications, users)
│   ├── validators/         # Zod schemas
│   └── utils/              # cn, formatDate, statusConfig…
├── store/                  # Zustand authStore
├── styles/                 # globals.css (design tokens, animations)
└── types/                  # TypeScript domain types
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Backend running on `http://localhost:8080` (Spring Boot)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Edit NEXT_PUBLIC_API_URL to point to your Spring Boot backend
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### Running

```bash
npm run dev      # Development server → http://localhost:3000
npm run build    # Production build
npm start        # Production server
```

### Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

### Type Check + Lint

```bash
npm run type-check    # TypeScript strict check
npm run lint          # ESLint
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | Indigo `#6366f1` |
| Display Font | Sora |
| Body Font | DM Sans |
| Radius | `rounded-xl` (12px) |
| Shadows | `shadow-glass`, `shadow-glow`, `shadow-card` |

### Component Usage

```tsx
// Button
<Button variant="primary" isLoading={loading} leftIcon={<Plus />}>
  Create
</Button>

// StatusBadge
<StatusBadge status="APPROVED" />

// Toast
const { success, error } = useToast();
success("Saved!", "Changes applied.");

// Modal
<Modal isOpen={open} onClose={() => setOpen(false)} title="Confirm">
  ...
</Modal>
```

---

## 🔌 API Integration

All API calls use the **Repository Pattern** under `src/lib/api/`:

```ts
// applicationRepository.getLatest({ pageSize: 10, sortBy: 'lastName' })
// nidRepository.verify(nid)
// nesaRepository.verify(indexNumber)
// userRepository.create(data)
// dashboardRepository.getStats()
```

The axios client at `src/lib/api/client.ts` handles:
- JWT Bearer token injection
- Automatic token refresh on 401
- Typed error responses

---

## 🧪 Test Coverage

| File | Tests |
|------|-------|
| `utils.test.ts` | `cn`, `formatDate`, `getInitials`, `truncate`, `calculatePercentage`, `formatFileSize`, `timeAgo`, `statusConfig`, `roleConfig` |
| `validators.test.ts` | All Zod schemas — login, register, NID, NESA, application, review, user |
| `ui.test.tsx` | Button, StatusBadge, RoleBadge, Badge components |
| `inputs.test.tsx` | Input, Textarea components |

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `next@14` | App router framework |
| `@tanstack/react-query` | Server state management |
| `zustand` | Client state (auth) |
| `react-hook-form` + `zod` | Form validation |
| `axios` | HTTP client with interceptors |
| `recharts` | Charts and visualizations |
| `framer-motion` | Animations |
| `react-dropzone` | CV file upload |
| `lucide-react` | Icon library |

---

## 📝 Next Steps — Backend (Spring Boot)

The backend needs to implement:

1. **Auth** — `POST /api/auth/login`, `/register`, `/logout`, `/refresh`, `GET /api/auth/me`
2. **Applications** — Full CRUD with review endpoint `PATCH /api/applications/:id/review`
3. **Users** — Admin CRUD with role management
4. **External APIs** — `/api/external/nid/verify`, `/api/external/nesa/verify`
5. **Dashboard** — `GET /api/dashboard/stats`

See `src/types/index.ts` for complete response type contracts.
