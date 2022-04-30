import puppeteer, { Browser } from 'puppeteer';
import logger from '../utils/logger';

export const startBrowser = async (): Promise<Browser | null> => {
  let browser;
  try {
    logger.log('info', 'Opening the browser......');
    const options = {
      headless: true,
      args: ['--disable-setuid-sandbox'],
      ignoreHTTPSErrors: true,
    };
    if (process.env.NODE_ENV !== 'development') {
      options["executablePath"] = '/usr/bin/chromium';
    }
    browser = await puppeteer.launch();
    return browser;
  } catch (err) {
    logger.log('info', 'Could not create a browser instance => : ', err);
    return null;
  }
};
