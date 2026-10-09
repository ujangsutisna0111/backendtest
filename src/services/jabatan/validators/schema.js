import Joi from "joi";

export const createJabatanSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().allow(null),
}).required();

export const jabatanIdSchema = Joi.object({
  jabatanId: Joi.string().trim().min(1).max(100).required(),
}).required();

export const updateJabatanSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100),
  description: Joi.string().allow(null),
})
  .min(1)
  .required();

export const createMenuAccessSchema = Joi.object({
  jabatanId: Joi.string().trim().min(1).max(100).required(),
  menuId: Joi.string().trim().min(1).max(100).required(),
}).required();
