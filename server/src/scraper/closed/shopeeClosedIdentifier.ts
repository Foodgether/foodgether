import { Page } from 'puppeteer';
import { CLOSED_KEYWORDS, CLOSED_MODAL_BODY_SELECTOR, CLOSED_MODAL_SELECTOR } from '../../configs/shoppee';

export default async (page: Page) => page.evaluate((
  { CLOSED_MODAL_SELECTOR, CLOSED_MODAL_BODY_SELECTOR, CLOSED_KEYWORDS },
) => {
  const modalElement = document.querySelector(CLOSED_MODAL_SELECTOR);
  const modalBody = modalElement.querySelector(CLOSED_MODAL_BODY_SELECTOR);
  return CLOSED_KEYWORDS.some((keyword) => modalBody.innerHTML.indexOf(keyword) >= 0);
}, { CLOSED_MODAL_SELECTOR, CLOSED_MODAL_BODY_SELECTOR, CLOSED_KEYWORDS });
