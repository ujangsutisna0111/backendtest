import Router from "express";

import {
  createJabatan,
  getJabatan,
  getJabatanById,
  getMenuAccessByJabatan,
  createMenuAccess,
} from "../controllers/jabatan_controllers.js";
import authenticate from "../../../middlewares/authentication.js";
import { validateBody, validateParam } from "../../../middlewares/validate.js";
import {
  createJabatanSchema,
  jabatanIdSchema,
  createMenuAccessSchema,
} from "../validators/schema.js";
import encDecode from "../../../middlewares/enc.js";

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
router.get(
  "/:jabatanId/menu",
  authenticate,
  validateParam(jabatanIdSchema),
  encDecode,
  getMenuAccessByJabatan,
);

router.post("/menu", validateBody(createMenuAccessSchema), createMenuAccess);

export default router;
