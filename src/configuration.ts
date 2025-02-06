export interface Configs {
  PORT: number;
  DATABASE_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  APP_MODE: string;
  JWT_SECRET: string;
}
export default (): Configs => ({
  PORT: Number(process.env.PORT),
  DATABASE_URL: process.env.DATABASE_URL,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  APP_MODE: process.env.APP_MODE,
  JWT_SECRET: process.env.JWT_SECRET,
});
