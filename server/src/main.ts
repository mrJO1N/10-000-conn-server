import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "redis";
import { models } from "./db/models.js";
import { getRouters } from "./routers/main.router.js";

/* -------- config */
const app = express();
dotenv.config();
const PORT = process.env.PORT ?? 80;
const redis = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

/* -------- init */
await models.User.sync({ force: true }); //always create a new table named "user"
await models.User.create({ balance: 10_000 });
await redis.set("userBalance", 10_000);

/* -------- middlewares */
app.use(cors());
app.use(express.json());
app.use("/api", getRouters(redis));

/* -------- footer */
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
