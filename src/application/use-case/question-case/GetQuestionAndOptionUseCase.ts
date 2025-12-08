import {
  OptionRepository,
  QuestionRepository,
} from "@/domain/repositories/QuestionRepository";

export class GetQuestionAndOptionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private optionrepository: OptionRepository
  ) {}

  async execute(dto: string): Promise<any> {
    const questions = await this.questionRepository.findByCourse(dto);
    const result = await Promise.all(
      (questions || []).map(async (question) => {
        const options = await this.optionrepository?.findByQuestion(
          question?.id
        );
        return { question, options: options };
      })
    );
    return result;
  }
}
