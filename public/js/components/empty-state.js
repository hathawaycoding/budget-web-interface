export function createEmptyState(title, description) {
  return `
    <div class="empty-state card">
      <p class="card__title">${title}</p>
      <p class="card__meta">${description}</p>
    </div>
  `;
}
