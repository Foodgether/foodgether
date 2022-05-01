import { Browser, Page } from 'puppeteer';
import { startBrowser } from './browser';
import { identifyClosed, identifyMenu } from './identifiers';
import logger from '../utils/logger';
import { IAgentOptions } from './interfaces';
import { SupportedSites } from '../constants/enums';
import { WAIT_SELECTOR as SHOPEE_WAIT_SELECTOR } from '../configs/shoppee';

class ScrapeAgent {
  private isHeadless: boolean;

  public type: SupportedSites;

  private browser: Browser;

  private page: Page;

  async initAgent(options: IAgentOptions) {
    this.isHeadless = options.isHeadless;
    this.type = options.type;
    this.browser = await startBrowser();
    if (!this.browser) {
      logger.error('Browser is not connected');
      throw new Error('Browser is not connected');
    }
    this.page = await this.browser.newPage();
  }

  async scrape(url: string) {
    await this.goTo(url);
    const isClosed = await identifyClosed(this.page, this.type);
    if (isClosed) {
      const message = `Store at ${url} is closed`;
      logger.log('info', message);
      throw new Error(message);
    }
    return identifyMenu(this.page, this.type);
  }

  private async goTo(url: string) {
    await this.page.goto(url);
    let waitSelector;
    switch (this.type) {
      case SupportedSites.SHOPEE:
        waitSelector = SHOPEE_WAIT_SELECTOR;
        break;
      default:
        throw new Error('Unsupported site');
    }
    await this.page.waitForSelector(waitSelector);
  }

  async close() {
    await this.browser.close();
  }
}

export default ScrapeAgent;
