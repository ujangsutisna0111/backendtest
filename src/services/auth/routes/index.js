import express from "express";

import { login, register } from "../controllers/auth_controllers.js";
import { validateBody } from "../../../middlewares/validate.js";
import { loginSchema, registerSchema } from "../validators/schema.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

export default router;
