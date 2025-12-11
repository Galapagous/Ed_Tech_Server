import { CreateResultUseCase } from "@/application/use-case/result-case/CreateResultUseCase";
import { NextFunction, Request, Response } from "express";

export class ResultController {
  constructor(private createResultUseCase: CreateResultUseCase) {}

  createResult = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const results = await this.createResultUseCase.execute(req.body);
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
