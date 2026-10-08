/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.createTable("menu_access", {
    id: {
      type: "VARCHAR(100)",
      primaryKey: true,
    },

    jabatan_id: {
      type: "VARCHAR(100)",
      notNull: true,
      references: "jabatan(id)",
      onDelete: "CASCADE",
    },

    menu_id: {
      type: "VARCHAR(100)",
      notNull: true,
      references: "menus(id)",
      onDelete: "CASCADE",
    },

    created_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },

    updated_at: {
      type: "TIMESTAMP",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP"),
    },
  });

  pgm.addConstraint(
    "menu_access",
    "unique_jabatan_menu",
    "UNIQUE(jabatan_id, menu_id)",
  );
};

export const down = (pgm) => {
  pgm.dropTable("menu_access");
};
