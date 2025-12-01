import { QuestionResponseDTO } from "@/application/dto/QuestionDTO";
import { Question } from "@/domain/entities/question";
import { QuestionRepository } from "@/domain/repositories/QuestionRepository";

export class GetQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute(dto: string): Promise<QuestionResponseDTO[]> {
    const questions = this.questionRepository.findById(dto);
    return questions as unknown as Question[];
  }
}
