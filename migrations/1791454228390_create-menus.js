/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.createTable("menus", {
    id: {
      type: "VARCHAR(100)",
      primaryKey: true,
    },

    name: {
      type: "VARCHAR(100)",
      notNull: true,
    },

    parent_id: {
      type: "VARCHAR(100)",
      references: "menus(id)",
      onDelete: "CASCADE",
    },

    path: {
      type: "VARCHAR(255)",
    },

    icon: {
      type: "VARCHAR(100)",
    },

    sort_order: {
      type: "INTEGER",
      notNull: true,
      default: 0,
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
};

export const down = (pgm) => {
  pgm.dropTable("menus");
};