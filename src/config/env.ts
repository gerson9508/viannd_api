import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["JWT_SECRET", "USDA_API_KEY", "DATABASE_URL"];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Variable de entorno requerida no definida: ${key}`);
  }
}

export const config = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET as string,
  usdaApiKey: process.env.USDA_API_KEY as string,
  databaseUrl: process.env.DATABASE_URL as string,
};