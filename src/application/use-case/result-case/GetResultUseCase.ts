import { QuestionRepository } from "@/domain/repositories/QuestionRepository";
import { ResultRepository } from "@/domain/repositories/ResultRepository";

export class GetResultUseCase {
  constructor(
    private resultRepository: ResultRepository,
    private questionRepository: QuestionRepository
  ) {}

  async execute(dto: string): Promise<any> {
    const results = await this.resultRepository.findByCourseId(dto);
    //  get total questions
    const question = await Promise.all(
      results?.map(async (result: any) => {
        return await this.questionRepository.findByCourse(result.course_id);
      })
    );
    const resultData = results?.map((result, index) => ({
      ...result,
      question: question[index]?.length,
    }));
    // const questions = await this.questionRepository.findByCourse(dto);
    return { resultData };
  }
}
