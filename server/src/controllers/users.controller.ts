import { Request, Response } from "express";
import { RedisClientType } from "redis";
import { models } from "../db/models.js";

class UsersController {
  private redisClient: RedisClientType;

  constructor(redisClient: any) {
    this.redisClient = redisClient;
    this.post = this.post.bind(this);
  }

  async post(req: Request, res: Response) {
    const { userId, amount } = req.body;

    const userModel = await models.User.findByPk(userId);
    if (!userModel) return res.status(404).json({ message: "User not found" });

    const balance = Number(await this.redisClient.get("userBalance"));
    const newBalance: number = amount + balance;

    if (newBalance < 0)
      return res.status(400).json({ message: "Insufficient funds" });

    await this.redisClient.set("userBalance", newBalance);
    userModel
      .set("balance", newBalance)
      .save()
      .then(() => res.json({ ...userModel.dataValues, balance: newBalance }));
  }
}

export default UsersController;
