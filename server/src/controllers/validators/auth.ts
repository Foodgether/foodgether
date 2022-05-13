import * as yup from 'yup';

export const LoginSchema = yup.object({
  phoneNumber: yup.string().required().trim().matches(/((09|03|07|08|05)+(\d{8})\b)/g),
  pin: yup.string().required().trim().min(4)
    .max(8)
    .matches(/^\d+$/g),
}).required();
