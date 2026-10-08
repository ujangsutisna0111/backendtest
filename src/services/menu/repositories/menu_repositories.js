import crypto from "node:crypto";
import pool from "../../../database/pool.js";
import InvariantError from "../../../exceptions/invariant-error.js";

const repository = {
  async createMenu({ name, parentId, path, icon }) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO menus (id, name, parent_id, path, icon)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, parent_id, path, icon, created_at, updated_at`,
        [
          crypto.randomUUID(),
          name,
          parentId ?? null,
          path ?? null,
          icon ?? null,
        ],
      );

      return rows[0];
    } catch (error) {
      if (error.code === "23503") {
        throw new InvariantError("Parent menu tidak ditemukan");
      }
      throw error;
    }
  },

  async getMenus() {
    const { rows } = await pool.query(
      `SELECT id, name, parent_id, path, icon, created_at, updated_at
       FROM menus
       ORDER BY name`,
    );

    return rows;
  },
  async getMenuAccessByJabatan(jabatanId) {
    const { rows } = await pool.query(
      `WITH RECURSIVE menu_tree AS 
      (
        SELECT
            m.id,
            m.name,
            m.parent_id,
            m.path,
            m.icon
        FROM menu_access ma
        JOIN menus m
            ON m.id = ma.menu_id
        WHERE ma.jabatan_id = $1

        UNION ALL
        
        SELECT
            child.id,
            child.name,
            child.parent_id,
            child.path,
            child.icon
        FROM menus child
        JOIN menu_tree parent
            ON child.parent_id = parent.id
     )

      SELECT
          id,
          name,
          parent_id,
          path,
          icon
      FROM menu_tree
      ORDER BY name
      ;
      `,
      [jabatanId],
    );
    const menus = new Map();

    rows.forEach((menu) => {
      menus.set(menu.id, {
        id: menu.id,
        name: menu.name,
        path: menu.path,
        icon: menu.icon,
        menus: [],
      });
    });

    const result = [];

    rows.forEach((menu) => {
      const current = menus.get(menu.id);

      if (menu.parent_id === null) {
        result.push(current);
      } else {
        const parent = menus.get(menu.parent_id);

        if (parent) {
          parent.menus.push(current);
        }
      }
    });

    return result;
  },

  async createMenuAccess({ jabatanId, menuId }) {
    try {
      const { rows } = await pool.query(
        `INSERT INTO menu_access (
           id, jabatan_id, menu_id
         )
         VALUES ($1, $2, $3)
         RETURNING id, jabatan_id, menu_id, created_at, updated_at`,
        [
          crypto.randomUUID(),
          jabatanId,
          menuId,
        ],
      );

      return rows[0];
    } catch (error) {
      if (error.code === "23505") {
        throw new InvariantError(
          "Akses menu sudah terdaftar untuk jabatan ini",
        );
      }
      if (error.code === "23503") {
        throw new InvariantError("Jabatan atau menu tidak ditemukan");
      }
      throw error;
    }
  },
};

export default repository;
