import * as yup from 'yup';

export const CreateInviteSchema = yup.object({
  restaurantId: yup.number().required()
}).required();

export const GetInviteSchema = yup.object({
  inviteId: yup.string().min(10).max(10).required()
}).required();

export const CreateOrderSchema = yup.object({
  inviteId: yup.string().min(10).max(10).required(),
  detail: yup.array().of(yup.object().shape({
    dishId: yup.number().min(1).required(),
    dishTypeId: yup.number().required(),
    quantity: yup.number().min(1).required(),
  })).min(1).required()
}).required();

export const ConfirmOrderSchema = yup.object({
  inviteId: yup.string().min(10).max(10).required()
}).required();