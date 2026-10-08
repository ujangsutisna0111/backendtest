import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(1).max(150).required(),
  username: Joi.string().trim().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
}).required();

export const loginSchema = Joi.object({
  username: Joi.string().trim().min(3).required(),
  password: Joi.string().min(6).required(),
}).required();
