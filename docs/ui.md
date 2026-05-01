# UI Coding Standards

## Overview

This document outlines the UI coding standards for the Lifting Diary project.

## UI Components

### Shadcn UI Components

**Requirement:** ONLY shadcn UI components should be used for UI elements in this project. **Absolutely no custom UI components should be created.**

All UI components must be sourced from shadcn/ui. Before creating any UI element, check if a shadcn component exists that meets the requirement.

If a needed component doesn't exist in shadcn, it should be added via:
```bash
npx shadcn@latest add [component-name]
```

## Date Formatting

### Standard

All date formatting must use `date-fns`. Do not use `toLocaleDateString` or other native date formatting methods.

### Format Pattern

Dates should be formatted using the `d` (day) and `do` (ordinal day) tokens with the `MMM` (abbreviated month) and `yyyy` (4-digit year) tokens.

Example output:
```
1st Sep 2005
2nd Aug 2025
3rd Jan 2026
4th Jun 2026
```

### Usage

```typescript
import { format } from "date-fns";

// Example: 2025-08-02 -> "2nd Aug 2025"
const formatted = format(date, "do MMM yyyy");
```