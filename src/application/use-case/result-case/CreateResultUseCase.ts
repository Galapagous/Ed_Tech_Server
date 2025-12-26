import { IdGenerator } from "@/application/interfaces/IdGenerator";
import { ResultRepository } from "@/domain/repositories/ResultRepository";
import { Result } from "@/domain/entities/result";
import { CreateResultDTO } from "@/application/validators/ResultValidator";
import {
  OptionRepository,
  QuestionRepository,
} from "@/domain/repositories/QuestionRepository";
import { AnswerRepository } from "@/domain/repositories/AnswerRepository";
import { Answer } from "@/domain/entities/answer";

export class CreateResultUseCase {
  constructor(
    private idGenerator: IdGenerator,
    private resultRepository: ResultRepository,
    private questionRepository: QuestionRepository,
    private optionRepository: OptionRepository,
    private answerRepository: AnswerRepository
  ) {}

  async execute(dto: CreateResultDTO): Promise<any> {
    // save answer
    const id = this.idGenerator.generate();
    let score: number = 0;
    const savedOptions = await Promise.all(
      dto.answers?.map(async (answer) => {
        const aid = this.idGenerator.generate();
        // create a new answer
        const questionInfo = await this.questionRepository.findById(
          answer.questionId
        );
        const options = await this.optionRepository.findByQuestion(
          answer.questionId
        );

        const validAns = options?.filter(
          (val) => val.option_id === questionInfo?.answer
        );
        const isCorrect = validAns && validAns[0].id === answer.answerId;
        if (isCorrect) score += 1;
        // save answer
        const savedAnswer = Answer.create(
          aid,
          answer.questionId,
          answer.answerId,
          id,
          isCorrect || false
        );

        return await this.answerRepository.save(savedAnswer);
      })
    );
    // save attempt
    const result = Result.create(id, dto.courseId, String(score));
    const savedResult = await this.resultRepository.save(result);

    return { ...savedResult };
  }
}
