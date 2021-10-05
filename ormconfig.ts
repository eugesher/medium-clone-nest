module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'admin',
  database: 'mediumclone',
  entities: ['dist/**/*.entity{.ts,.js}'],
};
