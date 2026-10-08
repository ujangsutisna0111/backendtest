import crypto from "node:crypto";
import pool from "../../../database/pool.js";
import InvariantError from "../../../exceptions/invariant-error.js";

const repository = {
  async getJabatanByKaryawanId(karyawanId) {
    const { rows } = await pool.query(
      `SELECT jk.jabatan_id,
              j.name AS jabatan
       FROM jabatan_karyawan jk
       JOIN jabatan j ON j.id = jk.jabatan_id
       WHERE jk.karyawan_id = $1
       ORDER BY j.name`,
      [karyawanId],
    );

    return rows;
  },

  async createJabatanKaryawan(karyawanId, jabatanId) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO jabatan_karyawan (id, karyawan_id, jabatan_id)
         VALUES ($1, $2, $3)
         RETURNING id, karyawan_id, jabatan_id, created_at, updated_at`,
        [crypto.randomUUID(), karyawanId, jabatanId],
      );

      return rows[0] ?? null;
    } catch (error) {
      if (error.code === "23505") {
        throw new InvariantError("Jabatan sudah terdaftar untuk karyawan ini");
      }
      if (error.code === "23503") {
        throw new InvariantError("Karyawan atau jabatan tidak ditemukan");
      }
      throw error;
    }
  },
};

export default repository;
