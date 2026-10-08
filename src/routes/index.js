import express from "express";

import auth from "../services/auth/routes/index.js";
import jabatan from "../services/jabatan/routes/index.js";
import jabatanKaryawan from "../services/jabatan_karyawan/routes/index.js";
import menu from "../services/menu/routes/index.js";

const router = express.Router();

router.use("/auth", auth);
router.use("/jabatan", jabatan);
router.use("/jabatankaryawan", jabatanKaryawan);
router.use("/menu", menu);

export default router;
