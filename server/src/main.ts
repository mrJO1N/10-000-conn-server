import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "redis";
import { models } from "./db/models.js";

/* -------- config */
const app = express();
dotenv.config();

/* -------- init */
const PORT = process.env.PORT ?? 80;
const redis = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

await models.User.sync({ force: true }); //always create a new table named "user"
await models.User.create({ balance: 10_000 });

/* -------- middlewares */
app.use(cors());
app.use(express.json());

/* -------- routes */
app.get("/", (req, res) => {
  redis.set("tes", "red");
  res.send(
    "you can send POST requests to '/deposit' with {userId,amount} in body"
  );
});
app.post("/", async (req, res) => {
  res.send(await redis.get("tes"));
});

app.post("/deposit", async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const userModel = await models.User.findByPk(userId);
  if (!userModel) return res.status(404).json({ message: "User not found" });

  const newBalance: number = amount + userModel?.dataValues.balance;

  if (newBalance < 0)
    return res.status(400).json({ message: "Insufficient funds" });

  userModel.set("balance", newBalance);
  userModel.save().then(() => res.json(userModel));

  // await userModel.update("balance", newBalance);
  // res.json(userModel);
});

/* -------- footer */
app.listen(PORT, () => console.log(`server listening on port ${PORT}`));
