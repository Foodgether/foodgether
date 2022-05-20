import { Request, Response } from 'express';
import parseUrl from '../utils/urlParser';
import Agent from '../scraper/agent';
import { GetMenuSchema } from './validators/menu';
import logger from '../utils/logger';
import { upsertRestaurant } from '../services/restaurant';
import { doesMenuExist, upsertMenu } from '../services/menu';

export const getMenuController = async (req: Request, res: Response) => {
  try {
    const { url } = await GetMenuSchema.validate(req.body);
    const type = parseUrl(url);
    const agent = new Agent();
    await agent.initAgent({ isHeadless: true, type });
    
    const scrapeResult = await agent.scrape(url);
    const restaurant = await upsertRestaurant(scrapeResult.restaurant);
    const menuId = await doesMenuExist(restaurant.id);
    const menu = await upsertMenu(scrapeResult.menu, restaurant.id, menuId);
    await agent.close();
    return res.status(200).json({menu, restaurant});
  } catch (err) {
    logger.log('error', `Failed at getting menu: ${err}\n${err.stack}`);
    return res.status(500).json({ message: err.message });
  }
};
