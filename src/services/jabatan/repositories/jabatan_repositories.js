import crypto from "node:crypto";
import { Pool } from "pg";
import InvariantError from "../../../exceptions/invariant-error.js";

class RepositoriesJabatan {
  constructor() {
    this.pool = new Pool();
  }
  async createJabatan({ name, description }) {
    try {
      const { rows } = await this.pool.query(
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
  }

  async getJabatan() {
    const { rows } = await this.pool.query(
      `SELECT id, name, description, created_at, updated_at
       FROM jabatan
       ORDER BY name`,
    );

    return rows;
  }

  async getJabatanById(jabatanId) {
    const { rows } = await this.pool.query(
      `SELECT id, name
       FROM jabatan
       WHERE id = $1`,
      [jabatanId],
    );

    return rows[0] ?? null;
  }

  async updateJabatan(jabatanId, { name, description }) {
    const hasName = name !== undefined;
    const hasDescription = description !== undefined;
    try {
      const { rows } = await this.pool.query(
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
  }

  async deleteJabatan(jabatanId) {
    const { rows } = await this.pool.query(
      `DELETE FROM jabatan
       WHERE id = $1
       RETURNING id, name, description`,
      [jabatanId],
    );

    return rows[0] ?? null;
  }

  async getJabatanByKaryawanId(karyawanId) {
    const { rows } = await this.pool.query(
      `SELECT jk.jabatan_id,
              j.name AS jabatan
       FROM jabatan_karyawan jk
       JOIN jabatan j ON j.id = jk.jabatan_id
       WHERE jk.karyawan_id = $1
       ORDER BY j.name`,
      [karyawanId],
    );

    return rows;
  }

  async createJabatanKaryawan(karyawanId, jabatanId) {
    try {
      const { rows } = await this.pool.query(
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
  }
}

export default new RepositoriesJabatan();
