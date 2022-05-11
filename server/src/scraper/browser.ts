import puppeteer, { Browser } from 'puppeteer';
import logger from '../utils/logger';

export const startBrowser = async (): Promise<Browser | null> => {
  let browser;
  try {
    logger.log('info', 'Opening the browser......');
    if (process.env.NODE_ENV === 'production') {
      browser = await puppeteer.connect({browserWSEndpoint: 'ws://host.docker.internal:5000'});
    }
    else {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
      });
    }
    return browser;
  } catch (err) {
    logger.log('info', 'Could not create a browser instance => : ', err);
    return null;
  }
};
