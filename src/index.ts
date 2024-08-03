import express, { Response, Request, Express } from 'express';
import router from './routes/routes';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import corsOptions from "./config/cors.options";
import path from 'path';
dotenv.config();
import mongoInit from './config/db.config';
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors(corsOptions)); 

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.use(router);
// Return JSON and also 404 page
app.all("*", (req: Request, res: Response) => {
    return res.status(404).json({ error: "Page not found" });
});

const init = async () => {
    await mongoInit();
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

init();

export default app