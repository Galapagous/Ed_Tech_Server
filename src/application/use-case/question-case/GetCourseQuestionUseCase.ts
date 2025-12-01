import { QuestionResponseDTO } from "@/application/dto/QuestionDTO";
import { Question } from "@/domain/entities/question";
import { QuestionRepository } from "@/domain/repositories/QuestionRepository";

export class GetCourseQuestionUseCase {
  constructor(private questionRepository: QuestionRepository) {}

  async execute(dto: string): Promise<QuestionResponseDTO[]> {
    const question = this.questionRepository.findByCourse(dto);
    return question as unknown as Question[];
  }
}
