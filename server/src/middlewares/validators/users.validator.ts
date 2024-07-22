import { Request, Response, NextFunction } from "express";
import Joi from "joi";

class UsersValidator {
  post(req: Request, res: Response, next: NextFunction) {
    const { userId, amount } = req.body;
    const bodyRequiredSchema = Joi.object({
      userId: Joi.number().required().integer().min(1),
      amount: Joi.number().required().integer(),
    });

    const fields = { userId, amount };
    const badField = //find undefined field
      Object.keys(fields)[Object.values(fields).indexOf(undefined)];
    if (badField) {
      return res.status(400).json({
        message: "Invalid request",
        bad: badField,
      });
    }

    const { error } = bodyRequiredSchema.validate({ userId, amount });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    next();
  }
}

export default new UsersValidator();
