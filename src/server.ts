import cors from "cors";
import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerDocs } from "./docs/swagger";

dotenv.config();

const app = express();

const server = createServer(app);

app.use(cors());
app.use(express.json());
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.get("/docs.json", (_req, res) => {
  res.json(swaggerDocs);
} )

app.get("/", (req, res) => {
  res.send("Hello World! NodeJS.");
});

server.listen(process.env.PORT, () => {
  console.log(`SERVER RODANDO NA PORTA: ${process.env.PORT} 🚀`);
});
