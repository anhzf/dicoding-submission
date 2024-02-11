const TABLE_NAME = 'albums';

/** @param pgm {import('node-pg-migrate').MigrationBuilder}  */
exports.up = (pgm) => {
  pgm.addColumn(TABLE_NAME, {
    cover: {
      type: 'TEXT',
      notNull: false,
    },
  });
};

/** @param pgm {import('node-pg-migrate').MigrationBuilder}  */
exports.down = (pgm) => {
  pgm.dropColumn(TABLE_NAME, 'cover');
};
