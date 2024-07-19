import express, { Response, Request, Express } from 'express';
import router from './routes/routes';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/cors.options";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors(corsOptions)); 

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.send("Express + TypeScript Server");
});

app.use(router);
app.all("*", (req: Request, res: Response) => {
    return res.json({ error: "Page not found" });
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app