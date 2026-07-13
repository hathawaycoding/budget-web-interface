# Budget Planner

## Goal

Build a lightweight budget planning application that feels like a modern online banking dashboard.

The app should:

- be responsive across desktop, tablet, and mobile
- load quickly
- use static JSON data with no database in v1
- be easy to replace with real APIs and persistence later
- present financial information clearly and confidently

## Confirmed Decisions

- Theme: dark theme
- Backend: Node.js with Express
- Frontend: HTML, CSS, Vanilla JavaScript using ES modules
- Architecture: stricter layered structure from `Ai_Development_Guide.md`
- Data source: static data in `server/data/`
- Version 1 navigation includes `Bills`
- Quick actions open mock dialogs in v1
- Charts and icon libraries are deferred to future enhancements
- Dependencies should stay minimal

## Proposed Architecture

```text
Browser
-> UI Components
-> Page Modules
-> Services
-> API Layer
-> Express Routes
-> Controllers
-> Static Data
```

### Architectural Notes

- UI components render data and handle local interactions only
- Page modules coordinate page-level rendering
- Services prepare and normalize API data for UI use
- `api.js` is the only place that performs `fetch()` calls
- Routes stay thin and delegate response logic to controllers
- Controllers read from static data modules and return JSON responses
- Static data should be treated as read-only to avoid coupling UI behavior to in-memory mutation

## Core Files

```text
server/
  index.js
  routes/
    dashboard-routes.js
    accounts-routes.js
    transactions-routes.js
    budget-routes.js
    goals-routes.js
    bills-routes.js
  controllers/
    dashboard-controller.js
    accounts-controller.js
    transactions-controller.js
    budget-controller.js
    goals-controller.js
    bills-controller.js
  data/
    sample-data.js
  test/
    sample-data.test.js
    api.test.js

public/
  index.html
  css/
    variables.css
    base.css
    layout.css
    navigation.css
    cards.css
    buttons.css
    forms.css
    tables.css
    dashboard.css
    responsive.css
    animations.css
  js/
    api/
      api.js
    components/
      balance-card.js
      summary-card.js
      budget-card.js
      goal-card.js
      transaction-table.js
      bill-list.js
      modal.js
      toast.js
      empty-state.js
      skeleton.js
    pages/
      dashboard-page.js
      accounts-page.js
      transactions-page.js
      budget-page.js
      goals-page.js
      bills-page.js
    services/
      dashboard-service.js
      accounts-service.js
      transactions-service.js
      budget-service.js
      goals-service.js
      bills-service.js
    utils/
      formatters.js
      dom.js
      state.js
      constants.js
      validators.js
    app.js
```

## Dependencies

### Required

- `express`

### Development

- `vitest`
- `jsdom`
- `supertest`
- `nodemon` optional for local development

### Not Needed In V1

- Chart.js
- Lucide icons
- database drivers
- frontend frameworks
- state management libraries

## Data Shape

### Dashboard

```js
{
  balance: 7435.21,
  income: 5200,
  expenses: 3120,
  savings: 2080,
  budgetRemaining: 1150
}
```

### Accounts

```js
[
  { id: 1, name: 'Checking', balance: 5431.12 },
  { id: 2, name: 'Savings', balance: 2004.09 },
  { id: 3, name: 'Credit Card', balance: -345.88 }
]
```

### Transactions

```js
{
  id: 1,
  date: '2026-07-10',
  merchant: 'Amazon',
  category: 'Shopping',
  amount: -53.22
}
```

### Budget Category

```js
{
  category: 'Food',
  budget: 600,
  spent: 420
}
```

### Goal

```js
{
  name: 'Vacation',
  current: 1300,
  target: 2000
}
```

### Bill

```js
{
  id: 1,
  merchant: 'Electric Company',
  amount: 120,
  dueDate: '2026-07-20',
  status: 'upcoming'
}
```

### API Endpoints

- `GET /api/dashboard`
- `GET /api/accounts`
- `GET /api/transactions`
- `GET /api/budget`
- `GET /api/goals`
- `GET /api/bills`

## UI Structure

### App Shell

- left sidebar navigation on desktop
- top bar with page title and mobile menu toggle
- main content area for page rendering
- mobile sidebar as overlay drawer

### Navigation

- Dashboard
- Accounts
- Transactions
- Budget
- Goals
- Bills

### Dashboard Page

- welcome header
- current balance card
- summary cards for income, expenses, savings, budget remaining
- recent transactions section
- spending breakdown section
- monthly budget overview section
- goals preview section
- upcoming bills preview section
- quick action buttons

### Accounts Page

- account summary cards
- account type and balance presentation

### Transactions Page

- transactions table inside a card
- search input
- category filter
- optional date filtering in v1 if simple enough
- empty state when no results match

### Budget Page

- budget category cards
- budget, spent, remaining values
- progress bars with warning and over-budget states

### Goals Page

- goal cards
- saved amount, target amount, completion percent
- progress indicators

### Bills Page

- upcoming bill list or cards
- due date, amount, and status badge

### Shared UI States

- loading skeletons
- empty states
- inline error messaging
- retry actions where API loading fails

## Error Handling

- every async API call uses `try/catch`
- show user-friendly error messages
- never expose stack traces in the UI
- render empty states when data arrays are empty
- provide retry buttons for recoverable fetch failures
- use `console.error()` only for actual errors
- validate DOM targets before rendering into them
- keep API responses read-only in services and UI modules

## Implementation Steps

### 1. Foundation

- create `package.json`
- create server entry point
- create layered directory structure
- configure static asset serving
- configure test tooling

### 2. Static Data Layer

- create `server/data/sample-data.js`
- add representative budget, account, transaction, goal, and bill data
- add tests for data shape

### 3. API Layer

- create route files for each resource
- create matching controllers
- wire routes into `server/index.js`
- verify all endpoints return the expected JSON

### 4. HTML Shell And CSS Foundation

- build the app shell in `public/index.html`
- add dark theme CSS variables
- build base layout, navigation, and responsive behavior
- organize CSS by responsibility

### 5. Frontend JS Foundation

- create `api.js`
- create shared formatters using `Intl.NumberFormat()` and `Intl.DateTimeFormat()`
- create app-level navigation state and page mounting flow
- establish page and service boundaries

### 6. Feature Pages

- build Dashboard page
- build Accounts page
- build Transactions page
- build Budget page
- build Goals page
- build Bills page

### 7. Shared Interaction Patterns

- add modal support for quick actions
- add toasts or inline notifications for errors
- add loading skeletons
- add empty states

### 8. Polish

- responsive refinements
- focus states and keyboard navigation
- reduced motion handling
- final spacing and typography pass

## Testing And Verification

### Automated

- `npm install`
- `npm run test:run`
- unit tests for static data shape
- API tests for each endpoint using `supertest`
- DOM rendering tests for key components and pages using `vitest` and `jsdom`

### Manual

- run the server locally
- verify dashboard and all navigation pages render
- verify mobile sidebar behavior
- verify loading, empty, and error states
- verify keyboard navigation and visible focus states
- verify currency and date formatting is consistent
- verify no console errors in the browser

## Risks And Tradeoffs

### Static Data Limits

V1 has no persistence, so quick actions and data changes are inherently mock behavior.

### Layered Structure Overhead

The stricter architecture improves maintainability and future growth, but adds more files than a flat prototype.

### Vanilla JS Complexity

Avoiding frameworks keeps dependencies low but requires careful organization to prevent duplicated DOM logic.

### No Charts In V1

Deferring charts keeps the build lighter and simpler, but some financial trends will be less visual in the first release.

### No Icon Library In V1

Deferring an icon package keeps dependencies down, but some interface affordances may rely more on text labels initially.

### Future Migration

The app should be designed so static JSON can later be replaced by real controllers, persistence, and authentication without rewriting the UI architecture.
