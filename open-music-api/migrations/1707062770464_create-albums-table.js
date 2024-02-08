const TABLE_NAME = 'albums';

/** @param pgm {import('node-pg-migrate').MigrationBuilder}  */
exports.up = (pgm) => {
  pgm.createTable(TABLE_NAME, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INT',
      notNull: true,
    },
  });
};

/** @param pgm {import('node-pg-migrate').MigrationBuilder}  */
exports.down = (pgm) => {
  pgm.dropTable(TABLE_NAME);
};
