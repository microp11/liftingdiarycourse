# Auth Coding Standards

## Overview

This document outlines the authentication standards for the Lifting Diary project.

## Authentication Provider

**Clerk** is the authentication provider for this application. All authentication-related functionality must be implemented using Clerk.

## Clerk Integration

### Middleware

Clerk middleware should be configured in `middleware.ts` at the project root to protect routes that require authentication.

### Authentication Hooks

Use Clerk's hooks (`useAuth`, `useUser`) in client components to access authentication state.

### Server-Side Auth

For server components, use Clerk's `auth()` helper to protect API routes and server-side data fetching.

## Protected Routes

All routes under `/dashboard` and other sensitive areas must be protected using Clerk middleware. Unauthenticated users should be redirected to the sign-in page.

## Environment Variables

The following environment variables are required for Clerk:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL`

## Best Practices

- Always use Clerk's provided components (`<SignIn>`, `<SignUp>`, `<UserButton>`) rather than building custom auth UI
- Leverage Clerk's middleware for route protection rather than implementing custom auth checks
- Use `useAuth()` for simple auth state checks and `useUser()` when user profile data is needed