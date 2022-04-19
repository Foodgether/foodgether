import express from 'express';
import logger from './utils/logger';
import Agent from './scraper/agent';
import {SupportedSites} from './constants/enums';
import parseUrl from './utils/urlParser';

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  // const url = 'https://shopeefood.vn/ho-chi-minh/quan-an-com-tam-31-dong-den';
  // const type = SupportedSites.SHOPEE;
  const url = 'https://shopeefood.vn/ho-chi-minh/gia-an-do-an-sang-duong-so-14';
  try {
    const type = parseUrl(url);
    const agent = new Agent();
    await agent.initAgent({ isHeadless: true, type});
    const menu = await agent.scrape(url);
    // logger.log('info', menu);
    await agent.close();
    return res.status(200).json(menu);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => logger.log('info', `Express is listening at http://localhost:${port}`));
