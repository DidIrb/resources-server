import { CorsOptions } from "cors";
import dotenv from "dotenv";
dotenv.config();

let allowedOrigins: string | string[];
if (process.env.ALLOWED_ORIGINS)
  allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS Testing to see if it works"));
    } 
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

export default corsOptions