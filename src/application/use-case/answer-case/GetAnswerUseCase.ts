import { AnswerRepository } from "@/domain/repositories/AnswerRepository";
import {
  OptionRepository,
  QuestionRepository,
} from "@/domain/repositories/QuestionRepository";

export class GetAnswerUseCase {
  constructor(
    private answerRepository: AnswerRepository,
    private questionRepository: QuestionRepository,
    private optionRepository: OptionRepository
  ) {}

  async execute(dto: string): Promise<AnswerRepository[]> {
    // fetch questions and answer
    const results = await this.answerRepository.findByAttemptId(dto);
    // attach question
    const resultInfo = await Promise.all(
      results.map(async (result: any) => {
        const questionInfo = await this.questionRepository.findById(
          result.questionid
        );
        const optionInfo = await this.optionRepository.findByQuestion(
          result.questionid
        );

        return { ...result, question: questionInfo, options: optionInfo };
      })
    );
    // attach options

    // console.log(resultInfo);
    return resultInfo as any;
  }
}
