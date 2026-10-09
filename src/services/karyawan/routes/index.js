import express from "express";

import authenticate from "../../../middlewares/authentication.js";
import { validateBody } from "../../../middlewares/validate.js";
import {
  getJabatanByKaryawan,
  createJabatanKaryawan,
} from "../controllers/karyawan_controllers.js";
import { createJabatanKaryawanSchema } from "../validators/schema.js";

const router = express.Router();

router.get("/jabatan", authenticate, getJabatanByKaryawan);
router.post(
  "/jabatan",
  validateBody(createJabatanKaryawanSchema),
  createJabatanKaryawan,
);

export default router;