import crypto from "node:crypto";
import pool from "../../../database/pool.js";
import InvariantError from "../../../exceptions/invariant-error.js";

const repository = {
  async createJabatan({ name, description }) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO jabatan (id, name, description)
         VALUES ($1, $2, $3)
         RETURNING id, name, description, created_at, updated_at`,
        [crypto.randomUUID(), name, description ?? null],
      );

      return rows[0];
    } catch (error) {
      if (error.code === "23505") {
        throw new InvariantError("Nama jabatan sudah digunakan");
      }
      throw error;
    }
  },

  async getJabatan() {
    const { rows } = await pool.query(
      `SELECT id, name, description, created_at, updated_at
       FROM jabatan
       ORDER BY name`,
    );

    return rows;
  },

  async getJabatanById(jabatanId) {
    const { rows } = await pool.query(
      `SELECT id, name, description, created_at, updated_at
       FROM jabatan
       WHERE id = $1`,
      [jabatanId],
    );

    return rows[0] ?? null;
  },

  async updateJabatan(jabatanId, { name, description }) {
    const hasName = name !== undefined;
    const hasDescription = description !== undefined;
    try {
      const { rows } = await pool.query(
        `UPDATE jabatan
         SET name = CASE WHEN $2 THEN $3 ELSE name END,
             description = CASE WHEN $4 THEN $5 ELSE description END,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING id, name, description, created_at, updated_at`,
        [jabatanId, hasName, name, hasDescription, description],
      );

      return rows[0] ?? null;
    } catch (error) {
      if (error.code === "23505") {
        throw new InvariantError("Nama jabatan sudah digunakan");
      }
      throw error;
    }
  },

  async deleteJabatan(jabatanId) {
    const { rows } = await pool.query(
      `DELETE FROM jabatan
       WHERE id = $1
       RETURNING id, name, description`,
      [jabatanId],
    );

    return rows[0] ?? null;
  },
};

export default repository;
