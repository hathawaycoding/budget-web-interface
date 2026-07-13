# Budget Planner Design System

Version: 1.0

## Stack

- HTML5
- CSS3 with custom properties
- Vanilla JavaScript using ES modules
- Express backend serving static assets and JSON endpoints

This design system is written for the version 1 build of the Budget Planner application.

## Visual Direction

The interface should feel like a modern banking dashboard with a dark theme.

The visual tone should be:

- calm
- trustworthy
- data-first
- efficient
- polished without being flashy

The app should not resemble a generic admin panel. It should prioritize financial clarity and a sense of control.

## Design Principles

### Clear

Financial information should be readable at a glance. Layouts should avoid clutter and surface the most important numbers first.

### Trustworthy

Spacing, typography, and motion should feel stable and predictable. Sudden animation or decorative excess should be avoided.

### Fast

Interactions should feel immediate. Motion should be subtle and short.

### Extendable

Future additions such as persistence, charts, reports, authentication, and AI insights should fit this design language without a redesign.

## Typography

### Font Stack

- `Inter`
- `Arial`
- `sans-serif`

### Type Scale

- Page title: `32px`, weight `700`
- Section title: `22px`, weight `600`
- Card title: `16px`, weight `600`
- Body: `15px`, weight `400`
- Small text: `13px`, weight `400`

### Usage Rules

- use strong hierarchy for money values
- keep labels short and plain
- avoid oversized headings outside primary sections
- use tabular numerals if available for financial values

## Core Utilities

### Color Tokens

```css
:root {
  --bg-primary: #1a1a2e;
  --bg-secondary: #16213e;
  --bg-card: #0f3460;
  --bg-card-hover: #14406f;
  --bg-overlay: rgba(8, 15, 30, 0.72);

  --text-primary: #e4e4e4;
  --text-secondary: #a0a0a0;
  --text-muted: #7f8aa3;

  --primary: #4a90d9;
  --primary-hover: #5ba3e6;
  --success: #27ae60;
  --danger: #e74c3c;
  --warning: #f39c12;
  --info: #5dade2;

  --border: rgba(255, 255, 255, 0.08);
  --focus-ring: rgba(91, 163, 230, 0.38);

  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.28);
  --shadow-md: 0 10px 24px rgba(0, 0, 0, 0.28);

  --radius-sm: 10px;
  --radius-md: 12px;
  --radius-lg: 16px;

  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 40px;
  --space-6: 48px;

  --sidebar-width: 240px;
  --top-bar-height: 64px;
  --motion-fast: 150ms;
  --motion-normal: 200ms;
}
```

### Spacing Rules

- base spacing unit is `8px`
- use only defined spacing tokens
- card padding should usually be `24px`
- dense controls may use `16px`

### Radius Rules

- buttons: `10px`
- cards: `12px`
- dialogs: `16px`
- inputs: `10px`

### Shadow Rules

- use soft shadows only
- avoid heavy floating effects
- increase elevation slightly on hover, never dramatically

### Breakpoints

- mobile: `< 768px`
- tablet: `768px - 1023px`
- desktop: `1024px+`

## Components

### Cards

Cards are the primary presentation pattern.

Each card should support:

- title
- primary value or content
- optional subtitle
- optional action

Card styling:

- background `var(--bg-card)`
- text `var(--text-primary)`
- radius `var(--radius-md)`
- padding `24px`
- border `1px solid var(--border)`
- shadow `var(--shadow-sm)`

### Buttons

#### Primary

- background `var(--primary)`
- text `var(--text-primary)` or white depending on contrast validation

#### Secondary

- background transparent or `var(--bg-secondary)`
- border `1px solid var(--border)`
- text `var(--text-primary)`

#### Danger

- background `var(--danger)`
- text white

Button rules:

- minimum height `44px`
- visible hover and focus states
- use short action labels

### Forms

- labels must appear above inputs
- placeholders are optional hints, not labels
- inputs should be full width by default
- required fields should be clearly indicated
- validation should be shown inline and in plain language

### Tables

Transactions should appear in a card-contained table.

Recommended columns:

- date
- merchant
- category
- amount

Optional v1 columns if needed:

- account
- status
- actions

Table behavior:

- readable row height
- hover row background using a subtle surface shift
- horizontal scroll on smaller screens

### Progress Indicators

Used for budget categories and goals.

Rules:

- neutral track with colored fill
- success for healthy progress
- warning for near-limit budget states
- danger for over-budget states

### Modals

Quick actions in v1 use mock dialogs.

Dialog rules:

- centered on desktop
- full-width friendly on mobile
- dark overlay using `var(--bg-overlay)`
- close with Escape and visible close button

### Empty States

Every page should have an empty state.

Each empty state should include:

- short title
- one-sentence explanation
- optional recovery action

### Loading States

Use skeleton loaders instead of blank sections.

Guidelines:

- match skeleton shape to final content
- use subtle shimmer only
- do not flash layout dimensions during load

### Notifications

Use lightweight inline alerts or toast messages for recoverable errors.

Rules:

- brief text
- clear next step when relevant
- color aligned to semantic meaning

## Layout

### Desktop

- fixed left sidebar
- top bar in the main content area
- main content uses section spacing and responsive grids

### Tablet

- sidebar may collapse or narrow
- content grids shift from four columns to two columns where needed

### Mobile

- sidebar becomes an overlay drawer
- top bar includes menu toggle and page title
- content stacks vertically
- tables allow horizontal scroll

### Dashboard Structure

Recommended section order:

1. Greeting and page header
2. Current balance card
3. Summary cards for income, expenses, savings, and budget remaining
4. Recent transactions
5. Spending breakdown
6. Monthly budget overview
7. Goals preview
8. Upcoming bills preview
9. Quick actions

### Navigation

Primary v1 navigation items:

- Dashboard
- Accounts
- Transactions
- Budget
- Goals
- Bills

Active navigation state should use:

- primary accent background or highlight
- stronger text contrast
- clear current-page indication

## Interaction

### Motion

- transitions should usually be `150ms` to `200ms`
- use fade, slide, or slight lift only
- avoid bounce, elastic, spin, or large parallax motion

### Hover

- cards may lift by `2px`
- buttons may darken slightly
- links may brighten or underline if appropriate

### Focus

- every interactive element needs a visible focus style
- prefer a clear focus ring using `var(--focus-ring)`
- never remove focus outlines without replacing them

### Errors

- show friendly language
- never surface stack traces
- provide retry affordances for data loading failures

### Quick Actions

Version 1 quick actions are mock interactions only.

They should:

- open quickly
- clearly indicate they are preview interactions if needed
- never imply persistence that does not exist

## Accessibility

- target WCAG AA contrast minimums
- all controls must be keyboard reachable
- inputs require associated labels
- buttons require accessible names
- dialogs require focus management
- navigation states must be conveyed beyond color alone
- respect `prefers-reduced-motion`
- touch targets should be at least `44px`

## Future Enhancements

These are intentionally outside v1 but should remain compatible with the system:

- Chart.js for spending and budget visualizations
- icon library such as Lucide
- authentication flows
- reports
- settings
- recurring transactions
- categories and tagging
- real persistence and CRUD endpoints
- AI insights

All future features should extend the same dark banking design language instead of introducing a separate visual style.
