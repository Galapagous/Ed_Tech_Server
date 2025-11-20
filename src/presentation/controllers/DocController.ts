import { CreateDocUseCase } from "@/application/use-case/doc-case/createDocUseCase";
import { UserValidator } from "@/application/validators/UserValidator";
import { Request, Response, NextFunction } from "express";

export class DocController {
  constructor(
    private createDocUseCase: CreateDocUseCase,
    private userValidator: UserValidator
  ) {}
  createDoc = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto = req.body;
      console.log("dto data -->", dto);
      const doc = this.createDocUseCase.execute(dto);
      res.status(201).json({
        status: true,
        data: doc,
        message: "Document created successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
