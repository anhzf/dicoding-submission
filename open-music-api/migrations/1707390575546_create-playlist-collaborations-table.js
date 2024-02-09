const TABLE_NAME = 'playlist_collaborations';

/** @param pgm {import('node-pg-migrate').MigrationBuilder}  */
exports.up = (pgm) => {
  pgm.createTable(TABLE_NAME, {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"playlists"',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
  });

  pgm.addConstraint(TABLE_NAME, 'unique_playlist_id_and_user_id', {
    unique: ['playlist_id', 'user_id'],
  });
};

/** @param pgm {import('node-pg-migrate').MigrationBuilder}  */
exports.down = (pgm) => {
  pgm.dropTable(TABLE_NAME);
};
