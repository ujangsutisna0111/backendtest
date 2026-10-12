import bcrypt from "bcrypt";
import crypto from "node:crypto";
import { Pool } from "pg";
import InvariantError from "../../../exceptions/invariant-error.js";

class Repositories {
  constructor() {
    this.pool = new Pool();
  }
  async addUser({ name, username, password }) {
    const passwordHash = await bcrypt.hash(password, 12);

    try {
      const { rows } = await this.pool.query(
        `INSERT INTO karyawan (id, name, username, password)
         VALUES ($1, $2, $3, $4)
         RETURNING id, name, username`,
        [crypto.randomUUID(), name, username, passwordHash],
      );

      return rows[0];
    } catch (error) {
      if (error.code === "23505") {
        throw new InvariantError("Username already exists");
      }
      throw error;
    }
  }

  async verifyUser({ username, password }) {
    const { rows } = await this.pool.query(
      `SELECT id, name, username, password
       FROM karyawan
       WHERE username = $1`,
      [username],
    );
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    const { password: _passwordHash, ...safeUser } = user;
    return safeUser;
  }
}

export default new Repositories();
