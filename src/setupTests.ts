import '@testing-library/jest-dom';

window.scrollTo = () => undefined;
Element.prototype.scrollIntoView = () => undefined;

const originalGetComputedStyle = window.getComputedStyle;
window.getComputedStyle = function (elt: Element, pseudoElt?: string | null) {
  try {
    return originalGetComputedStyle.call(window, elt, pseudoElt);
  } catch {
    return {
      getPropertyValue: () => '',
      display: 'inline',
      visibility: 'visible',
    } as unknown as CSSStyleDeclaration;
  }
};
