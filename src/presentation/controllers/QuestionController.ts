import { CreateCourseUseCase } from "@/application/use-case/course-case/CreateCourseUseCase";
import { CreateQuestionUseCase } from "@/application/use-case/question-case/CreateQuestionUseCase";
import { UserValidator } from "@/application/validators/UserValidator";
import { Request, Response, NextFunction } from "express";

export class QuestionController {
  constructor(
    private createQuestionUseCase: CreateQuestionUseCase,
    private userValidator: UserValidator
  ) {}

  createQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const courseId = req.params?.id;
      const owner = this.userValidator.validateToken(req, res);
      const questuons = this.createQuestionUseCase.execute(courseId);
      res.status(201).json({
        status: true,
        data: questuons,
        message: "Questions generated successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
