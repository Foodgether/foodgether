import * as yup from 'yup';

export const CreateInviteSchema = yup.object({
  restaurantId: yup.number().required()
}).required();

export const GetInviteSchema = yup.object({
  inviteId: yup.string().min(10).max(10).required()
}).required();
