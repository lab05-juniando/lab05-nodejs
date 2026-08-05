import cors from "cors";
import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const server = createServer(app);

app.use(cors());
app.use(express.json());

server.listen(process.env.PORT, () => {
  console.log(`SERVER RODANDO NA PORTA: ${process.env.PORT} 🚀`);
});
