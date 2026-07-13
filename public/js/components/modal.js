import { getElement, renderInto } from '../utils/dom.js';

let lastFocusedElement = null;

function handleFocusTrap(event) {
  if (event.key !== 'Tab') {
    return;
  }

  const root = getElement('#modal-root');
  const focusableElements = [...(root?.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') || [])]
    .filter((element) => !element.hasAttribute('disabled'));

  if (!focusableElements.length) {
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
    return;
  }

  if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

export function openModal({ title, description = '', content = '', eyebrow = 'Quick action' }) {
  const root = getElement('#modal-root');

  if (!root) {
    return;
  }

  lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  renderInto(root, `
    <div class="modal-overlay" data-close-modal>
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="section-heading">
          <div>
            <p class="card__label">${eyebrow}</p>
            <h3 id="modal-title">${title}</h3>
          </div>
          <button class="button-secondary" type="button" data-close-modal>Close</button>
        </div>
        ${description ? `<p class="card__meta">${description}</p>` : ''}
        ${content}
      </div>
    </div>
  `);

  root.querySelector('button[data-close-modal]')?.focus();
  root.addEventListener('keydown', handleFocusTrap);
}

export function closeModal() {
  const root = getElement('#modal-root');
  root?.removeEventListener('keydown', handleFocusTrap);
  renderInto(root, '');
  lastFocusedElement?.focus();
}
