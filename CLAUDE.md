# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 (App Router) project with React 19 and Tailwind CSS v4. It was bootstrapped with `create-next-app`.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

- **App Router** (`src/app/`): Uses Next.js App Router with React Server Components. Page files use `.tsx` extension.
- **Styling**: Tailwind CSS v4 with PostCSS. Global styles in `src/app/globals.css`.
- **Fonts**: Uses `next/font/google` for Geist and Geist_Mono fonts.
- **Layout**: Root layout in `src/app/layout.tsx` wraps all pages. Uses flex column with antialiased styling.

## Key Files

- `src/app/layout.tsx` - Root layout with font configuration and metadata
- `src/app/page.tsx` - Main page component
- `src/app/globals.css` - Global Tailwind styles
- `eslint.config.mjs` - ESLint configuration (flat config format)
- `postcss.config.mjs` - PostCSS configuration for Tailwind
- `next.config.ts` - Next.js configuration