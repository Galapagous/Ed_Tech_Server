import { GetAnswerUseCase } from "@/application/use-case/answer-case/GetAnswerUseCase";
import { NextFunction, Request, Response } from "express";

export class AnswerController {
  constructor(private getAnswerUseCase: GetAnswerUseCase) {}

  getAnswer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id: dto } = req.params;
      const result = await this.getAnswerUseCase.execute(dto);
      res.status(200).json({
        status: true,
        data: result,
        message: "Answer fetched successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
