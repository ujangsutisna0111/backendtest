import Router from "express";

import {
  createJabatan,
  createJabatanKaryawan,
  getJabatan,
  getJabatanById,
  getJabatanByKaryawan,
} from "../controllers/jabatan_controllers.js";
import authenticate from "../../../middlewares/authentication.js";
import { validateBody, validateParam } from "../../../middlewares/validate.js";
import {
  createJabatanSchema,
  createJabatanKaryawanSchema,
  jabatanIdSchema,
} from "../validators/schema.js";

const router = Router();

router.get("/", authenticate, getJabatan);
router.post(
  "/",

  validateBody(createJabatanSchema),
  createJabatan,
);
router.get(
  "/:jabatanId",
  authenticate,
  validateParam(jabatanIdSchema),
  getJabatanById,
);

router.get("/karyawan", authenticate, getJabatanByKaryawan);
router.post(
  "/karyawan",
  validateBody(createJabatanKaryawanSchema),
  createJabatanKaryawan,
);

export default router;
