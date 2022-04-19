import * as yup from 'yup';

export const GetMenuSchema = yup.object({
  url: yup.string().required(),
  getOutOfStock: yup.boolean().required(),
}).required();
