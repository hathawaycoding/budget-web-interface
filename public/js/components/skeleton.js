export function createSkeletonCard(label = 'Loading data') {
  return `
    <div class="skeleton-card card" aria-label="${label}">
      <div style="height: 16px; width: 120px; background: rgba(255,255,255,0.06); border-radius: 999px;"></div>
      <div style="height: 40px; width: 60%; background: rgba(255,255,255,0.08); border-radius: 12px;"></div>
      <div style="height: 14px; width: 80%; background: rgba(255,255,255,0.05); border-radius: 999px;"></div>
    </div>
  `;
}

export function createSkeletonGrid(count = 3) {
  return `<div class="summary-grid">${Array.from({ length: count }, () => createSkeletonCard()).join('')}</div>`;
}
