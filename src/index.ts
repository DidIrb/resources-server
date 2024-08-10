import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Express, Request, Response } from 'express';
import path from 'path';
import corsOptions from "./config/cors.options";
import mongoInit from './config/db.config';
import limiter from './middleware/limiter.middleware';
import router from './routes/routes';
import { reloadWebsite } from "./utils/reload";
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import options from "./config/swagger.config";

dotenv.config();
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors(corsOptions)); 
app.use(express.static("public"));
app.use(express.json());

// const interval: number = 30000; // 30 seconds
const interval: number = 600000; // 10 minutes

setInterval(reloadWebsite, interval);

app.set('trust proxy', 1);

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsdoc(options);

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(limiter);

app.get('/ip', (req, res) => {
    res.send(req.ip);
});

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