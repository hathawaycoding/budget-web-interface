import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dashboardRoutes from './routes/dashboard-routes.js';
import accountsRoutes from './routes/accounts-routes.js';
import transactionsRoutes from './routes/transactions-routes.js';
import budgetRoutes from './routes/budget-routes.js';
import goalsRoutes from './routes/goals-routes.js';
import billsRoutes from './routes/bills-routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDirectory = path.resolve(__dirname, '../public');
const port = Number(process.env.PORT || 3000);

const app = express();

app.use(express.json());
app.use(express.static(publicDirectory));

app.use('/api/dashboard', dashboardRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/bills', billsRoutes);

app.use('/api', (_request, response) => {
  response.status(404).json({ message: 'API route not found.' });
});

app.use((error, _request, response, _next) => {
  if (!error.statusCode || error.statusCode >= 500) {
    console.error(error);
  }

  response.status(error.statusCode || 500).json({
    message: error.statusCode ? error.message : 'Unexpected server error.',
  });
});

app.get('*', (_request, response) => {
  response.sendFile(path.join(publicDirectory, 'index.html'));
});

export function startServer() {
  return app.listen(port,"0.0.0.0",() => {
    console.log(`Budget Planner running on http://localhost:${port}`);
    console.log(`Budget Planner running on http://192.168.1.113:${port}`);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  startServer();
}

export default app;
