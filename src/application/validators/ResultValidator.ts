import { Answer } from "@/domain/entities/answer";
import Joi from "joi";

interface AnswerDTO {
  questionId: string;
  answerId: string;
}

export interface CreateResultDTO {
  answers: AnswerDTO[];
  courseId: string;
}

export class ResultValidator {
  private answer = Joi.object({
    questionId: Joi.string().required(),
    answerId: Joi.string().required(),
  });

  private createResultSchema = Joi.object<CreateResultDTO>({
    answers: Joi.array().items(this.answer).required(),
    courseId: Joi.string().required(),
  });

  validateCreate(data: unknown): CreateResultDTO {
    const { error, value } = this.createResultSchema.validate(data);
    if (error) {
      throw new Error(
        `Validation error: ${error.details.map((e) => e.message).join(", ")}`
      );
    }
    return value;
  }
}
