import { CreateCourseUseCase } from "@/application/use-case/course-case/CreateCourseUseCase";
import { CreateQuestionUseCase } from "@/application/use-case/question-case/CreateQuestionUseCase";
import { GetCourseQuestionUseCase } from "@/application/use-case/question-case/GetCourseQuestionUseCase";
import { UserValidator } from "@/application/validators/UserValidator";
import { Request, Response, NextFunction } from "express";

export class QuestionController {
  constructor(
    private createQuestionUseCase: CreateQuestionUseCase,
    private userValidator: UserValidator,
    private getCourseQuestionUseCase: GetCourseQuestionUseCase
  ) {}

  createQuestion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const courseId = req.body?.id;
      const owner = this.userValidator.validateToken(req, res);
      const questuons = await this.createQuestionUseCase.execute(courseId);
      res.status(201).json({
        status: true,
        data: questuons,
        message: "Questions generated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  getQuestions = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const courseId = req?.params?.id;
      const owner = this.userValidator.validateToken(req, res);
      const questions = await this.getCourseQuestionUseCase.execute(courseId);
      res.status(200).json({
        status: true,
        data: questions.length,
        message: "Message fetch successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
