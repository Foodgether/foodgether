import { Browser, Page } from 'puppeteer';
import { startBrowser } from './browser';
import { identifyClosed, identifyMenu } from './identifiers';
import logger from '../utils/logger';
import { IAgentOptions } from './interfaces';

class ScrapeAgent {
  private isHeadless: boolean;

  private browser: Browser;

  private page: Page;

  async initAgent(options: IAgentOptions) {
    this.isHeadless = options.isHeadless;
    this.browser = await startBrowser();
    this.page = await this.browser.newPage();
  }

  async scrape(url: string) {
    await this.goTo(url);
    const isClosed = await identifyClosed(this.page);
    if (isClosed) {
      const message = `Store at ${url} is closed`;
      logger.log('info', message);
      throw new Error(message);
    }
    return identifyMenu(this.page);
  }

  private async goTo(url: string) {
    await this.page.goto(url);
    await this.page.waitForSelector('#app > div > div.container.relative.clearfix > div.now-menu-restaurant > div.menu-restaurant-content-tab > div > div.menu-restaurant-detail');
  }

  async close() {
    await this.browser.close();
  }
}

export default ScrapeAgent;
