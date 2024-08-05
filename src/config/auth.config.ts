import dotenv from "dotenv";
dotenv.config();
export const env = process.env;

const config = {
    secret : env.ACCESS_TOKEN_SECRET,
    secret_key : env.SECRET_KEY,
    jwtExpiration : 60,
    jwtRefreshExpiration : 120
}

export const site = env.SITE
export default config