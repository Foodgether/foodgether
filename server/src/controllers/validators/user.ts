import * as yup from 'yup';

export const CreateUserSchema = yup.object({
  name: yup.string().required().trim().min(3),
  phoneNumber: yup.string().required().trim().matches(/((09|03|07|08|05)+(\d{8})\b)/g),
  pin: yup.string().required().trim().min(4)
    .max(8)
    .matches(/^\d+$/g),
}).required();
