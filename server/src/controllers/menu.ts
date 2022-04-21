import { Request, Response } from 'express';
import parseUrl from '../utils/urlParser';
import Agent from '../scraper/agent';
import { GetMenuSchema } from './validators/menu';

export const getMenuController = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { url } = await GetMenuSchema.validate(req.body);
    const type = parseUrl(url);
    const agent = new Agent();
    await agent.initAgent({ isHeadless: true, type });
    const menu = await agent.scrape(url);
    await agent.close();
    return res.status(200).json(menu);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
