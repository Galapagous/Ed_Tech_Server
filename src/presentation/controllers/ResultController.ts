import { CreateResultUseCase } from "@/application/use-case/result-case/CreateResultUseCase";
import { GetResultUseCase } from "@/application/use-case/result-case/GetResultUseCase";
import { ResultValidator } from "@/application/validators/ResultValidator";
import { NextFunction, Request, Response } from "express";

export class ResultController {
  constructor(
    private createResultUseCase: CreateResultUseCase,
    private getCourseResultUseCase: GetResultUseCase,
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

  getCourseResult = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const courseId = req?.params?.courseId;
      const result = await this.getCourseResultUseCase.execute(courseId);
      res.status(200).json({
        status: true,
        data: result,
        message: "Result fetched",
      });
    } catch (error) {
      next(error);
    }
  };
}
