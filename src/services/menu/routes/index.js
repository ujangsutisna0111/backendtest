import express from "express";

import authenticate from "../../../middlewares/authentication.js";
import {
  validateBody,
  validateParam,
} from "../../../middlewares/validate.js";
import {
  createMenu,
  createMenuAccess,
  getMenuAccessByJabatan,
  getMenus,
} from "../controllers/menu_controllers.js";
import {
  createMenuAccessSchema,
  createMenuSchema,
  jabatanIdSchema,
} from "../validators/schema.js";

const router = express.Router();

router.get("/", authenticate, getMenus);
router.post("/", authenticate, validateBody(createMenuSchema), createMenu);
router.get(
  "/access/:jabatanId",
  authenticate,
  validateParam(jabatanIdSchema),
  getMenuAccessByJabatan,
);
router.post(
  "/access",
  authenticate,
  validateBody(createMenuAccessSchema),
  createMenuAccess,
);

export default router;
