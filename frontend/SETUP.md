# 🚀 Quick Setup Guide

Follow these steps **in order** after extracting the zip.

## Step 1 — Install dependencies

Open a terminal inside the `recruitment-system` folder and run:

```bash
npm install
```

> ⚠️ Do NOT run `npm start` before `npm install` — there is nothing to start yet.

## Step 2 — Run in development mode

```bash
npm run dev
```

Then open your browser at: **http://localhost:3000**

## Step 3 — Other available commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start dev server (with hot reload) |
| `npm run build` | Create production build |
| `npm start` | Start production server (run `build` first!) |
| `npm test` | Run all 72 unit tests |
| `npm run type-check` | Check TypeScript types |
| `npm run lint` | Run ESLint |

## Common Errors & Fixes

### ❌ `Missing script: "dev"`
**Cause:** You ran `npm start` or `npm install` was not done yet.
**Fix:** Run `npm install` first, then `npm run dev`.

### ❌ `Cannot find module './globals.css'`
**Cause:** VS Code opened the project before all files were extracted.
**Fix:** This is a VS Code display glitch — reload the window (`Ctrl+Shift+P` → "Reload Window"). The file exists at `src/app/globals.css`.

### ❌ `Cannot find module 'next'`
**Cause:** `npm install` was not run.
**Fix:** Run `npm install`.

### ❌ Port 3000 already in use
**Fix:** Run on a different port: `npm run dev -- -p 3001`

## Environment Variables (optional for now)

Create a `.env.local` file in the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Without this, the app defaults to `http://localhost:8080/api` automatically.
The frontend will run fine without a backend — pages will show loading states.
