import keywords from '../constants/keywords';
import { SupportedSites } from '../constants/enums';
import { UNSUPPORTED_SITE_ERROR } from '../constants/error';

export default (url: string): SupportedSites => {
  let urlType: SupportedSites | null = null;
  keywords.forEach((keyword) => {
    if (url.indexOf(keyword) > -1) {
      urlType = SupportedSites[keyword.toUpperCase()];
    }
  });
  if (!urlType) {
    throw new Error(UNSUPPORTED_SITE_ERROR);
  }
  return urlType;
};
