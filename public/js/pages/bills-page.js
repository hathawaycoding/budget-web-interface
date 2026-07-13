import { createBillList } from '../components/bill-list.js';
import { createEmptyState } from '../components/empty-state.js';
import { createSkeletonGrid } from '../components/skeleton.js';
import { getBillsData } from '../services/bills-service.js';

export async function renderBillsPage(container) {
  container.innerHTML = createSkeletonGrid(2);

  const bills = await getBillsData();

  if (!bills.length) {
    container.innerHTML = createEmptyState('No upcoming bills', 'Bill reminders will appear here once recurring payments are available.');
    return;
  }

  container.innerHTML = `
    <div class="page-stack">
      <article class="card section-stack">
        <div class="section-heading">
          <div>
            <h3>Upcoming bills</h3>
            <p>Scheduled payments are grouped into a single view so due dates stay visible.</p>
          </div>
        </div>
        ${createBillList(bills)}
      </article>
    </div>
  `;
}
