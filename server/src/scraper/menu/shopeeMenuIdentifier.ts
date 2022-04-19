import { Page } from 'puppeteer';
import logger from '../../utils/logger';
import {
  ITEM_IMAGE_ATTRIBUTE, ITEM_IMAGE_SELECTOR,
  ITEM_NAME_SELECTOR,
  ITEM_OUT_OF_STOCK_SELECTOR,
  ITEM_PRICE_SELECTOR, ITEM_PRICE_SPLITTER,
  ITEM_SELECTOR,
} from '../../configs/shoppee';

export default async (page: Page) => {
  logger.log('info', 'Identifying Shopee Menu');

  return page.evaluate(({
    ITEM_SELECTOR, ITEM_OUT_OF_STOCK_SELECTOR,
    ITEM_NAME_SELECTOR, ITEM_PRICE_SELECTOR,
    ITEM_PRICE_SPLITTER, ITEM_IMAGE_SELECTOR,
    ITEM_IMAGE_ATTRIBUTE,
  }) => {
    const results = [];
    const items = document.querySelectorAll(ITEM_SELECTOR);
    items.forEach((item) => {
      // Out of stock
      if (item.querySelector(ITEM_OUT_OF_STOCK_SELECTOR)) {
        return;
      }
      const name = item.querySelector(ITEM_NAME_SELECTOR).innerHTML;
      const price = item.querySelector(ITEM_PRICE_SELECTOR).innerHTML.split(ITEM_PRICE_SPLITTER)[0];
      const image = item.querySelector(ITEM_IMAGE_SELECTOR).getAttribute(ITEM_IMAGE_ATTRIBUTE);
      results.push({
        name,
        price,
        image,
      });
    });
    return results;
  }, {
    ITEM_SELECTOR,
    ITEM_OUT_OF_STOCK_SELECTOR,
    ITEM_NAME_SELECTOR,
    ITEM_PRICE_SELECTOR,
    ITEM_PRICE_SPLITTER,
    ITEM_IMAGE_SELECTOR,
    ITEM_IMAGE_ATTRIBUTE,
  });
};
