import { ConnectionOptions } from 'typeorm';

const connectionOptions: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'admin',
  password: 'admin',
  database: 'mediumclone',
  synchronize: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: { migrationsDir: 'src/migrations' },
};

export default connectionOptions;
