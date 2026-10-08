import Joi from "joi";

export const createJabatanKaryawanSchema = Joi.object({
  jabatanId: Joi.string().trim().min(1).max(100).required(),
  karyawanId: Joi.string().trim().min(1).max(100).required(),
}).required();
