import { Page } from "puppeteer";
import logger from "../../utils/logger";
import {
  GETTING_MENU_FAILED,
  GETTING_MENU_TIMEDOUT,
  GETTING_RESTAURANT_INFO_FAILED,
} from "../../constants/error";

export default async (page: Page) =>
  new Promise<ShopeeScrapeResult>((resolve, reject) => {
    logger.log("info", "Identifying Shopee Menu");
    let menu = null;
    let restaurant = null;
    let isMenuReady = false;
    let isRestaurantReady = false;
    let totalTime = 0;

    page.reload();
    page.on("response", async (response) => {
      if (
        response.url().indexOf("get_delivery_dishes") > 0 &&
        response.request().method() !== "OPTIONS"
      ) {
        menu = await response.json();
        if (menu && menu.reply && menu.result !== "success") {
          clearInterval(menuInterval);
          reject(GETTING_MENU_FAILED);
        }
        menu = menu.reply.menu_infos as Menu[];
        isMenuReady = true;
      }
      if (
        response.url().indexOf("get_detail") > 0 &&
        response.request().method() !== "OPTIONS"
      ) {
        restaurant = await response.json();
        if (restaurant && restaurant.reply && restaurant.result !== "success") {
          clearInterval(menuInterval);
          reject(GETTING_RESTAURANT_INFO_FAILED);
        }
        restaurant = restaurant.reply.delivery_detail;
        isRestaurantReady = true;
      }
    });
    const menuInterval = setInterval(() => {
      if (isMenuReady && isRestaurantReady) {
        logger.log("info", "Shopee Menu Identified");
        clearInterval(menuInterval);
        resolve({ restaurant, menu });
      }
      if (totalTime === 15 * 1000) {
        clearInterval(menuInterval);
        reject(GETTING_MENU_TIMEDOUT);
      }
      totalTime += 100;
    }, 100);
  });

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

export interface Rating {
  total_review: number;
  avg: number;
  display_total_review: string;
  app_link: string;
}

export interface AvailableTime {
  date: string;
  times: string[];
}

export interface ServiceFee {
  text: string;
  value: number;
}

export interface FormatText {
  resource_name: string;
  resource_args: string[];
}

export interface AvgPrice {
  text: string;
  format_text: FormatText;
  unit: string;
  value: number;
}

export interface MinOrderValue {
  text: string;
  unit: string;
  value: number;
}

export interface WeekDay {
  start_time: string;
  week_day: number;
  end_time: string;
}

export interface Time {
  available: any[];
  week_days: WeekDay[];
  not_available: any[];
}

export interface Text {
  resource_name: string;
}

export interface Operating {
  status: number;
  color: string;
  close_time: string;
  open_time: string;
  text: Text;
}

export interface Text2 {
  resource_name: string;
  resource_args: string[];
}

export interface ShippingFee {
  text: Text2;
  value: number;
  is_increasing: number;
  rate: number;
  minimum_fee: string;
  unit: string;
}

export interface Delivery {
  service_fee: ServiceFee;
  merchant_limit_distance: number;
  delivery_alert?: any;
  prepare_duration: number;
  payment_methods: number[];
  avg_price: AvgPrice;
  min_order_value: MinOrderValue;
  is_peak_mode: boolean;
  min_charge: string;
  is_open: boolean;
  promotions: any[];
  service_by: string;
  has_contract: boolean;
  ship_types: any[];
  setting_limit_distance: number;
  merchant_time: number;
  time: Time;
  operating: Operating;
  shipping_fee: ShippingFee;
  is_foody_delivery: boolean;
}

export interface Photo {
  width: number;
  value: string;
  height: number;
}

export interface ConfirmMethods {}

export interface MinOrderValue2 {
  text: string;
  unit: string;
  value: number;
}

export interface PriceRange {
  min_price: number;
  max_price: number;
}

export interface Position {
  latitude: number;
  is_verified: boolean;
  longitude: number;
}

export interface Photo2 {
  width: number;
  value: string;
  height: number;
}

export interface ResPhoto {
  photos: Photo2[];
}

export interface Restaurant {
  total_order: number;
  rating: Rating;
  is_subscribe: boolean;
  is_favorite: boolean;
  city_id: number;
  phones: string[];
  restaurant_id: number;
  district_id: number;
  brand_id: number;
  video?: any;
  asap_is_available: boolean;
  contract_type: number;
  id: number;
  location_url: string;
  foody_service_id: number;
  is_quality_merchant: boolean;
  available_times: AvailableTime[];
  is_city_alert: boolean;
  categories: string[];
  cuisines: string[];
  short_description?: any;
  url_rewrite_name: string;
  price_slash_discounts: any[];
  delivery_fees: any[];
  vat?: any;
  confirm_language?: any;
  service_type: number;
  brand?: any;
  limit_distance: number;
  delivery_categories: number[];
  user_favorite_count: number;
  delivery: Delivery;
  photos: Photo[];
  is_display_cutlery: boolean;
  confirm_methods: ConfirmMethods;
  address: string;
  name_en: string;
  is_now_delivery: boolean;
  min_order_value: MinOrderValue2;
  root_category_ids: number[];
  campaigns: any[];
  name: string;
  url: string;
  display_order: number;
  delivery_id: number;
  restaurant_url: string;
  is_pickup: boolean;
  price_range: PriceRange;
  parent_category_id: number;
  position: Position;
  res_photos: ResPhoto[];
}

export interface ShopeeScrapeResult {
  menu: Menu[];
  restaurant: Restaurant;
}
