import { CreateUserUseCase } from "@/application/use-case/user-cases/CreateUserUseCase";
import { GetUserUseCase } from "@/application/use-case/user-cases/GetUserUseCase";
import { LoginUserUseCase } from "@/application/use-case/user-cases/LoginUserUseCase";
import { UserValidator } from "@/application/validators/UserValidator";
import { Request, Response, NextFunction } from "express";
// import JwtTokenService from "../service/token";
import { jwtTokenService } from "../service/jwtService";

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private getUserUseCase: GetUserUseCase,
    private userValidator: UserValidator,
    private loginUserUseCase: LoginUserUseCase
  ) {}

  createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto = this.userValidator.validateCreateUser(req.body);
      const user = await this.createUserUseCase.execute(dto);
      res.status(201).json({
        status: true,
        data: user,
        message: "User created successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = req.params.id;
      const user = await this.getUserUseCase.execute(id);

      res.status(200).json({
        status: true,
        data: user,
        message: "User fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await this.loginUserUseCase.execute(req.body);
      const userToken = jwtTokenService.generate({
        id: user.id,
      });
      res.status(200).json({
        status: true,
        data: { ...user, token: userToken },
        message: "User login success",
      });
    } catch (error) {
      next(error);
    }
  };
}
