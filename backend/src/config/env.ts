import dotenv from "dotenv";

dotenv.config();

const requiredEnvVariables = [
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

for (const variable of requiredEnvVariables) {
  if (!process.env[variable]) {
    throw new Error(`Missing environment variable: ${variable}`);
  }
}

export const env = {
  port: Number(process.env.PORT) || 5000,

  nodeEnv: process.env.NODE_ENV || "development",

  mongodbUri: process.env.MONGODB_URI as string,

  jwtAccessSecret: process.env.JWT_ACCESS_SECRET as string,

  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET as string,

  clientUrl: process.env.CLIENT_URL || "*",
};