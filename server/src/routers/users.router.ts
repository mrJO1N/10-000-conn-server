import { Router } from "express";
import UsersController from "../controllers/users.controller.js";
import validator from "../middlewares/validators/users.validator.js";

const router = Router();

export const getRouters = (redisClient: unknown) => {
  const controller = new UsersController(redisClient);

  router.post("/deposit", validator.post, controller.post);

  return router;
};
