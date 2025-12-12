import { CreateResultUseCase } from "@/application/use-case/result-case/CreateResultUseCase";
import { ResultValidator } from "@/application/validators/ResultValidator";
import { NextFunction, Request, Response } from "express";

export class ResultController {
  constructor(
    private createResultUseCase: CreateResultUseCase,
    private resultValidator: ResultValidator
  ) {}

  createResult = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const dto = this.resultValidator.validateCreate(req.body);
      const results = await this.createResultUseCase.execute(dto);
      res.status(201).json({
        status: true,
        data: results,
        message: "Result generation successfull",
      });
    } catch (error) {
      next(error);
    }
  };
}
