/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.createTable("jabatan_karyawan", {
    id: {
      type: "VARCHAR(100)",
      primaryKey: true,
    },

    karyawan_id: {
      type: "VARCHAR(100)",
      notNull: true,
      references: "karyawan(id)",
      onDelete: "CASCADE",
    },

    jabatan_id: {
      type: "VARCHAR(100)",
      notNull: true,
      references: "jabatan(id)",
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
    "jabatan_karyawan",
    "unique_jabatan_karyawan",
    "UNIQUE(karyawan_id, jabatan_id)",
  );
};

export const down = (pgm) => {
  pgm.dropTable("jabatan_karyawan");
};