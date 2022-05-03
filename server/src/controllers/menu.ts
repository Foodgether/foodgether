import { Request, Response } from 'express';
import parseUrl from '../utils/urlParser';
import Agent from '../scraper/agent';
import { GetMenuSchema } from './validators/menu';
import { getPrismaClient } from '../prisma';
import logger from '../utils/logger';


export const getMenuController = async (req: Request, res: Response) => {
  try {
    const { url } = await GetMenuSchema.validate(req.body);
    const type = parseUrl(url);
    const agent = new Agent();
    await agent.initAgent({ isHeadless: true, type });
    const menu = await agent.scrape(url);
    await agent.close();
    const prisma = getPrismaClient();
    const user = await prisma.user.create({
      data: {
        name: 'test',
        phoneNumber: '0919696148',
        pin: '1234'
      }
    })
    logger.log('info', user);
    return res.status(200).json(menu);
  } catch (err) {
    logger.log('error', `Failed at getting menu: ${err}`, );
    return res.status(500).json({ message: err.message });
  }
};
