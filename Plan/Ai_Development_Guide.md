# AI_DEVELOPMENT_GUIDE.md

# Purpose

This document defines how AI assistants should contribute to this repository.

Any AI generating code for this project should follow these rules.

The goal is consistency, maintainability, and readability over cleverness.

---

# Project Overview

This project is a lightweight budgeting application.

Current Technology Stack

Backend

- Node.js
- Express

Frontend

- HTML
- CSS
- Vanilla JavaScript (ES6 Modules)

Storage

- None (Static JSON)

Future

- SQLite
- PostgreSQL
- Authentication
- REST API
- AI Insights

---

# Development Philosophy

Always optimize for

- Readability
- Simplicity
- Small files
- Reusable code
- Clear naming

Never optimize for writing the fewest lines.

Readable code is preferred over clever code.

---

# Architecture

Follow this architecture.

Browser

↓

UI Components

↓

Services

↓

API Layer

↓

Express Routes

↓

Data

Never skip layers.

Example

Dashboard

↓

dashboard.js

↓

dashboardService.js

↓

api.js

↓

GET /api/dashboard

---

# Folder Structure

/public

/css

/js

/components

/pages

/services

/utils

/server

/routes

/controllers

/data

Never create folders outside this structure unless requested.

---

# JavaScript Rules

Always

Use

const

Prefer

let

Never use

var

---

Always use

ES Modules

Example

import

export

Never use CommonJS unless working inside Express configuration.

---

Functions

Prefer

Small functions

Maximum

40 lines

If a function exceeds 40 lines,

consider extracting helpers.

---

One responsibility per function.

Bad

calculateBudgetAndRenderDashboard()

Good

calculateBudget()

renderDashboard()

renderSummary()

renderTransactions()

---

# CSS Rules

Use

CSS Variables

Never hardcode colors.

Bad

color: blue;

Good

color: var(--primary);

---

Organize CSS by feature.

Avoid one massive stylesheet.

---

# HTML Rules

Semantic HTML only.

Use

header

main

section

article

aside

footer

button

nav

Avoid excessive div nesting.

---

# Naming

Variables

camelCase

Functions

camelCase

Classes

PascalCase

Files

kebab-case

CSS

BEM or simple component classes

Choose one approach and stay consistent.

---

# Components

Each UI component should be responsible for one thing.

Example

BalanceCard

Only displays account balance.

It should not

- fetch data
- calculate values
- manipulate unrelated UI

---

# API Rules

Always access server data through

api.js

Never fetch directly inside UI components.

Bad

fetch(...)

inside dashboard.js

Good

dashboard.js

↓

api.getDashboard()

↓

fetch()

---

# Data Rules

Never mutate server data directly.

Clone objects before modification.

Treat API responses as read-only.

---

# Error Handling

Every async operation should include

try

catch

Display user-friendly messages.

Never expose stack traces.

---

# Logging

Use

console.error()

only for errors.

Avoid unnecessary logging.

Remove temporary debugging before finalizing code.

---

# Performance

Prefer

Simple loops

Avoid premature optimization.

Cache DOM references when appropriate.

Avoid repeated DOM queries inside loops.

---

# Accessibility

Buttons must have accessible labels.

Inputs require associated labels.

Images require alt text.

Interactive elements must support keyboard navigation.

---

# Responsive Design

Every new component should support

Desktop

Tablet

Mobile

Never assume a fixed screen width.

---

# State Management

Since this project is small,

keep state local.

Example

const dashboardState = {}

Avoid introducing state management libraries.

---

# Dependencies

Before adding a dependency,

ask

Can this be written in less than 50 lines?

If yes,

do not install another package.

Keep dependencies minimal.

---

# Libraries

Allowed

Express

Future

Chart.js

Not allowed without approval

React

Vue

Angular

Redux

Tailwind

Bootstrap

Material UI

jQuery

Lodash

Moment

---

# Code Style

Prefer early returns.

Example

if (!transactions.length) {
    return;
}

Avoid deeply nested if statements.

Maximum nesting depth

3

---

# Comments

Write comments explaining

WHY

not

WHAT

Bad

// Increment counter

counter++;

Good

// Keep IDs sequential until database support is added

counter++;

---

# Financial Formatting

Always display

Currency

using

Intl.NumberFormat()

Never manually concatenate "$".

---

# Date Formatting

Use

Intl.DateTimeFormat()

Avoid manual string manipulation.

---

# Reusability

Before creating

Button

Card

Modal

Table

Ask

Can an existing component be reused?

Avoid duplicate components.

---

# Design Compliance

All UI must follow

Design.md

Do not invent new colors,

spacing,

or typography.

---

# Future Compatibility

Write code assuming

authentication

database

real APIs

will eventually exist.

Do not tightly couple the UI to static JSON.

---

# Before Creating New Files

Check whether an existing file can reasonably contain the new functionality.

Avoid unnecessary file proliferation.

---

# Before Writing Code

Always ask:

1. Is this the simplest solution?

2. Is this reusable?

3. Is this readable?

4. Does it match the Design System?

5. Will this still work after a database is added?

If any answer is "No",

refactor before writing code.

---

# Pull Request Checklist (Mental Checklist)

Before considering work complete, verify:

- No duplicate logic was introduced.
- Functions have a single responsibility.
- No unused variables or imports remain.
- No console debugging statements remain.
- Styling follows Design.md.
- Responsive behavior has been considered.
- Accessibility requirements are met.
- New code is modular and reusable.
- Existing components were reused where appropriate.
- Future database integration was not made more difficult.

---

# Guiding Principle

When in doubt,

choose the simpler solution.

This project values maintainability and clarity over cleverness.