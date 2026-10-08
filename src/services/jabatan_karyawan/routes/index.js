import express from "express";

import {
  createJabatanKaryawan,
  getJabatanByKaryawan,
} from "../controllers/jabatan_karyawan_controllers.js";
import authenticate from "../../../middlewares/authentication.js";
import { validateBody } from "../../../middlewares/validate.js";
import { createJabatanKaryawanSchema } from "../validators/schema.js";

const router = express.Router();

router.get("/", authenticate, getJabatanByKaryawan);
router.post(
  "/",
  validateBody(createJabatanKaryawanSchema),
  createJabatanKaryawan,
);

export default router;
