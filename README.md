# Budget Planner

Budget Planner is a lightweight personal finance dashboard built with Node.js, Express, HTML, CSS, and vanilla JavaScript.

It provides a dark-theme budgeting interface with:

- dashboard overview
- accounts
- transactions
- budget categories
- goals
- bills
- quick actions for adding expenses, income, transfers, and editing transactions

## Stack

- Node.js
- Express
- HTML5
- CSS3
- Vanilla JavaScript with ES modules
- Vitest
- Supertest

## Features

- responsive layout for desktop and mobile
- dark banking-style UI
- static seed data fallback
- persisted JSON file updates for create and edit flows
- transaction search, category filtering, date filtering, and sorting
- in-app quick action forms
- accessible navigation, dialogs, and focus states

## Project Structure

```text
server/
  controllers/
  data/
  routes/
  services/
  test/

public/
  css/
  js/
    api/
    components/
    pages/
    services/
    utils/

scripts/
Plan/
```

## Install

```bash
npm install
```

## Run

Default:

```bash
npm start
```

If port `3000` is already in use:

```bash
PORT=3100 npm start
```

## Scripts

```bash
npm start
npm run dev
npm run lint
npm run typecheck
npm run build
npm run test:run
```

## Persistence Behavior

The app uses two data sources:

- `server/data/sample-data.js`
- `server/data/budget-planner.json`

Behavior:

- if `server/data/budget-planner.json` exists, the app reads from it
- if it does not exist, the app falls back to `sample-data.js`
- when you create or edit data in the app, changes are written to `server/data/budget-planner.json`

This means:

- the app starts with sample data on a fresh setup
- once you make changes, they persist across refreshes and server restarts

### Reset Demo Data

Delete the persisted file:

```bash
rm server/data/budget-planner.json
```

Then restart the app. It will fall back to the sample data again.

## API Endpoints

### Read

- `GET /api/dashboard`
- `GET /api/accounts`
- `GET /api/transactions`
- `GET /api/budget`
- `GET /api/goals`
- `GET /api/bills`

### Mutations

- `POST /api/transactions/expenses`
- `POST /api/transactions/income`
- `POST /api/transactions/transfers`
- `PUT /api/transactions/:id`

## Viewing On Your Phone

Make sure your phone and your computer are on the same Wi-Fi network.

Start the app:

```bash
PORT=3100 npm start
```

Then open the app on your phone using your computer's local IP address:

```text
http://YOUR_LOCAL_IP:3100
```

Example:

```text
http://192.168.1.113:3100
```

If it does not load:

- confirm the server is running
- confirm the phone is on the same network
- check local firewall settings

## Testing

Run the full test suite:

```bash
npm run test:run
```

Current coverage includes:

- sample data validation
- API route behavior
- JSON persistence behavior
- transaction filtering and sorting
- frontend rendering behavior
- frontend session data updates

## Notes

- transfer entries are persisted as paired transaction records
- transfer rows cannot be edited directly in the current version
- persistence is JSON-file based and intended for a local/demo workflow, not multi-user production use
