import { getElement } from '../utils/dom.js';

export function showToast(message) {
  const root = getElement('#toast-root');

  if (!root) {
    return;
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  root.appendChild(toast);

  window.setTimeout(() => {
    toast.remove();
  }, 3000);
}
