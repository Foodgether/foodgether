import { Page } from 'puppeteer';
import logger from '../../utils/logger';
import {GETTING_MENU_TIMEDOUT} from '../../constants/error';

export default async (page: Page) => new Promise((resolve, reject) => {
  logger.log('info', 'Identifying Shopee Menu');
  let result = null;
  let totalTime = 0;
  page.reload();
  page.on('response', async (response) => {
    if (response.url().indexOf("get_delivery_dishes") > 0 && response.request().method() != "OPTIONS"){
      result = await response.json();
    }
  })
  const menuInterval = setInterval(() => {
    if (result != null && result.result === "success"){
      logger.log('info', 'Shopee Menu Identified');
      clearInterval(menuInterval);
      resolve(result.reply.menu_infos);
    }
    if (totalTime === 15*1000 || (result && result.reply.result !== "success")) {
      clearInterval(menuInterval);
      reject(GETTING_MENU_TIMEDOUT);
    }
    totalTime += 100
  }, 100);
})
