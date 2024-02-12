const TABLE_NAME = 'user_album_likes';

/** @param pgm {import('node-pg-migrate').MigrationBuilder}  */
exports.up = (pgm) => {
  pgm.createTable(TABLE_NAME, {
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"albums"',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint(TABLE_NAME, 'unique_user_id_and_album_id', {
    unique: ['user_id', 'album_id'],
  });
};

/** @param pgm {import('node-pg-migrate').MigrationBuilder}  */
exports.down = (pgm) => {
  pgm.dropTable(TABLE_NAME);
};
