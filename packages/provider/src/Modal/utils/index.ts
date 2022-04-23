import { getDocumentOrThrow } from "./window-getters";

const IMPERSONATOR_WRAPPER_ID = "impersonator-wrapper";
const IMPERSONATOR_STYLE_ID = "impersonator-style-sheet";

export const renderWrapper = (): HTMLDivElement => {
  const doc = getDocumentOrThrow();
  const prev = doc.getElementById(IMPERSONATOR_WRAPPER_ID);
  if (prev) {
    doc.body.removeChild(prev);
  }
  const wrapper = doc.createElement("div");
  wrapper.setAttribute("id", IMPERSONATOR_WRAPPER_ID);
  doc.body.appendChild(wrapper);
  return wrapper;
};

export const injectStyleSheet = () => {
  const doc = getDocumentOrThrow();
  const prev = doc.getElementById(IMPERSONATOR_STYLE_ID);
  if (prev) {
    doc.head.removeChild(prev);
  }
  const style = doc.createElement("style");
  style.setAttribute("id", IMPERSONATOR_STYLE_ID);
  style.innerText = `
    #${IMPERSONATOR_WRAPPER_ID} {
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      pointer-events: none;
      z-index: 99999999999999 !important;
    }
  `;
  doc.head.appendChild(style);
};
