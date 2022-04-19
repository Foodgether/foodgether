import { SupportedSites } from '../constants/enums';

export interface IScrapedMenuItem {
  name: string;
  price: number;
  image: string;
}

export interface IAgentOptions {
  isHeadless: boolean;
  type: SupportedSites;
}
