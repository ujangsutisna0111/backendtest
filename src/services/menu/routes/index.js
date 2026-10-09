import express from "express";

import { validateBody } from "../../../middlewares/validate.js";
import { createMenu } from "../controllers/menu_controllers.js";
import { createMenuSchema } from "../validators/schema.js";
import authenticate from "../../../middlewares/authentication.js";

const router = express.Router();
router.post("/", authenticate, validateBody(createMenuSchema), createMenu);

export default router;
