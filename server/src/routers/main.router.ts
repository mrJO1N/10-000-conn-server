import { Router } from "express";
import { getRouters as getUsersRouter } from "./users.router.js";

const router = Router();

export const getRouters = (redisClient: unknown) => {
  router.use("/users", getUsersRouter(redisClient));

  router.get("/", (req, res) => {
    res.send(
      "you can send POST requests to '/deposit' with {userId,amount} in body"
    );
  });

  return router;
};
