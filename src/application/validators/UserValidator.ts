import Joi from "joi";
import { CreateUserDTO, UpdateUserDTO } from "../dto/UserDTOs";
import { Request, Response } from "express";
import { jwtTokenService } from "@/presentation/service/jwtService";

export class UserValidator {
  private createUserSchema = Joi.object<CreateUserDTO>({
    email: Joi.string().email().required(),
    username: Joi.string().min(2).max(50).required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      }),
  });

  private updateUserSchema = Joi.object<UpdateUserDTO>({
    email: Joi.string().email().optional(),
    username: Joi.string().min(2).max(50).optional(),
  });

  validateCreateUser(data: unknown): CreateUserDTO {
    const { error, value } = this.createUserSchema.validate(data);
    if (error) {
      throw new Error(
        `Validation error: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    return value;
  }

  validateUpdateUser(data: unknown): UpdateUserDTO {
    const { error, value } = this.updateUserSchema.validate(data);
    if (error) {
      throw new Error(
        `Validation error: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    return value;
  }

  validateToken(req: Request, res: Response): string | void {
    let token = req.headers.authorization?.split(" ")[1];
    if (!req.headers.authorization || token === undefined) {
      res.status(401).json({
        status: false,
        message: "token not found",
      });
      throw new Error("Token not found");
    }
    token = token.replace(/^["']|["']$/g, "");
    const user: any = jwtTokenService.verify(token as string);
    if (!user) {
      res.status(401).json({
        status: false,
        message: "Invalid token",
      });
      throw new Error("Invalid token");
    }
    return user.id;
  }
}
