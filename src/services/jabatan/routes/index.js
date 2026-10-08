import express from "express";

import {
  createJabatan,
  deleteJabatan,
  getJabatan,
  getJabatanById,
  updateJabatan,
} from "../controllers/jabatan_controllers.js";
import authenticate from "../../../middlewares/authentication.js";
import { validateBody, validateParam } from "../../../middlewares/validate.js";
import {
  createJabatanSchema,
  jabatanIdSchema,
  updateJabatanSchema,
} from "../validators/schema.js";

const router = express.Router();

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
router.patch(
  "/:jabatanId",
  authenticate,
  validateParam(jabatanIdSchema),
  validateBody(updateJabatanSchema),
  updateJabatan,
);
router.delete(
  "/:jabatanId",
  authenticate,
  validateParam(jabatanIdSchema),
  deleteJabatan,
);

export default router;
