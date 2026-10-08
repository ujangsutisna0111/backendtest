/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.createTable("karyawan", {
    id: {
      type: "VARCHAR(100)",
      primaryKey: true,
    },

    username: {
      type: "VARCHAR(100)",
      notNull: true,
      unique: true,
    },

    password: {
      type: "VARCHAR(255)",
      notNull: true,
    },

    name: {
      type: "VARCHAR(150)",
      notNull: true,
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
  pgm.dropTable("karyawan");
};
