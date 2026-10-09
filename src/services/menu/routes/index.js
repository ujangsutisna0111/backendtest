import express from "express";

import authenticate from "../../../middlewares/authentication.js";
import encDecode from "../../../middlewares/enc.js";
import { validateBody, validateParam } from "../../../middlewares/validate.js";
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
router.post("/", validateBody(createMenuSchema), createMenu);
router.get(
  "/access/:jabatanId",

  authenticate,

  validateParam(jabatanIdSchema),
  encDecode,
  getMenuAccessByJabatan,
);
router.post("/access", validateBody(createMenuAccessSchema), createMenuAccess);

export default router;
