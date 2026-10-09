import Joi from "joi";

export const createMenuSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  parentId: Joi.string().trim().min(1).max(100).allow(null),
  path: Joi.string().max(255).allow(null),
  icon: Joi.string().max(100).allow(null),
}).required();
