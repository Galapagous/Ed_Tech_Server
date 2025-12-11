import { QuestionRepository } from "@/domain/repositories/QuestionRepository";

export class CreateResultUseCase {
  constructor() {}

  async execute(dto: string): Promise<any> {
    // fetch the questions
    return "save result";
  }
}
