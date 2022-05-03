import { Page } from 'puppeteer';
import logger from '../../utils/logger';
import {GETTING_MENU_TIMEDOUT} from '../../constants/error';

export default async (page: Page) => new Promise<Menu>((resolve, reject) => {
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

export interface Price {
  text: string;
  value: number;
  unit: string;
}

export interface DiscountPrice {
  text: string;
  value: number;
  unit: string;
}

export interface Photo {
  width: number;
  value: string;
  height: number;
}

export interface NtopPrice {
  text: string;
  unit: string;
  value: number;
}

export interface Price2 {
  text: string;
  unit: string;
  value: number;
}

export interface Item {
  name: string;
  weight: number;
  ntop_price: NtopPrice;
  max_quantity: number;
  is_default: boolean;
  top_order: number;
  price: Price2;
  id: number;
}

export interface OptionItems {
  min_select: number;
  max_select: number;
  items: Item[];
}

export interface Option {
  ntop: string;
  mandatory: boolean;
  id: number;
  option_items: OptionItems;
  name: string;
}

export interface WeekDay {
  start: string;
  week_day: number;
  end: string;
}

export interface Time {
  available: any[];
  week_days: WeekDay[];
  not_available: any[];
}

export interface Dish {
  is_deleted: boolean;
  description: string;
  name: string;
  price: Price;
  is_active: boolean;
  discount_price: DiscountPrice;
  total_like: string;
  properties: any[];
  photos: Photo[];
  options: Option[];
  is_available: boolean;
  limit_type: number;
  is_searchable: boolean;
  time: Time;
  id: number;
  discount_remaining_quantity: number;
  display_order: number;
  is_group_discount_item: boolean;
  quantity: number;
  available_time: string;
}

export interface Menu {
  dish_type_id: number;
  display_order: number;
  dish_type_name: string;
  dishes: Dish[];
  is_group_discount: boolean;
}