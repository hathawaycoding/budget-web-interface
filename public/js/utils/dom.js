export function getElement(selector) {
  return document.querySelector(selector);
}

export function renderInto(element, markup) {
  if (!element) {
    return;
  }

  element.innerHTML = markup;
}

export function setHidden(element, hidden) {
  if (!element) {
    return;
  }

  element.hidden = hidden;
}
