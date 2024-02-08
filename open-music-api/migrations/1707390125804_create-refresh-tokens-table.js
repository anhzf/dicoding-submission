const TABLE_NAME = 'refresh_tokens';

/** @param pgm {import('node-pg-migrate').MigrationBuilder}  */
exports.up = (pgm) => {
  pgm.createTable(TABLE_NAME, {
    token: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

/** @param pgm {import('node-pg-migrate').MigrationBuilder}  */
exports.down = (pgm) => {
  pgm.dropTable(TABLE_NAME);
};
