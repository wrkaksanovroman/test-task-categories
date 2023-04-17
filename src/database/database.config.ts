import { Category } from '../category/entities/category.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Category],
  migrations: ['dist/database/migrations/*.*'],
  synchronize: false,
  // logging: !!process.env.TYPEORM_LOGGING_FLAG,
  logging: !true,
};

console.log('process.env.POSTGRES_HOST: ', process.env.POSTGRES_HOST);

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
