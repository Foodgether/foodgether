import { Page } from 'puppeteer';
import logger from '../utils/logger';
import { IScrapedMenuItem } from './interfaces';

export const identifyMenu = async (page: Page): Promise<IScrapedMenuItem[]> => {
  logger.log('info', 'Identifying Menu');
  return page.evaluate(() => {
    const results = [];
    const items = document.querySelectorAll('div.item-restaurant-row');
    items.forEach((item) => {
      // Out of stock
      if (item.querySelector('div.btn-over')) {
        return;
      }
      const name = item.querySelector('h2.item-restaurant-name').innerHTML;
      const price = item.querySelector('div.current-price').innerHTML.split('<')[0];
      const image = item.querySelector('img').getAttribute('src');
      results.push({
        name,
        price,
        image,
      });
    });
    return results;
  });
};

export const identifyClosed = async (page: Page): Promise<boolean> => page.evaluate(() => {
  const modalElement = document.querySelector('#modal');
  const modalBody = modalElement.querySelector('div.modal-body');
  return modalBody.innerHTML.includes('Ngoài giờ') || modalBody.innerHTML.includes('đóng');
});
