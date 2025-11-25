import { IdGenerator } from "@/application/interfaces/IdGenerator";
import { Option } from "@/domain/entities/option";
import { Question } from "@/domain/entities/question";
import { DocRepository } from "@/domain/repositories/DocRepository";
import {
  OptionRepository,
  QuestionRepository,
} from "@/domain/repositories/QuestionRepository";
import {
  AiService,
  IOption,
  IQuestion,
} from "@/infrastructure/services/AIGenerator";
import { generatePDF } from "@/infrastructure/services/PDFParser";

export class CreateQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private optionRepository: OptionRepository,
    private idGenerator: IdGenerator,
    private docRepository: DocRepository,
    private aiGenerator: AiService
  ) {}

  async execute(dto: string): Promise<any> {
    const docs = await this.docRepository.findByCourseId(dto);

    if (!docs) return [];

    const result = await Promise.all(
      docs.map(async (doc) => {
        const pdfText = await generatePDF(doc.url);
        const questions = await this.aiGenerator.generateQuestion(pdfText);
        if (questions === undefined)
          throw new Error("Error Generating question");
        return Promise.all(
          questions?.questions?.map(async (question: IQuestion) => {
            const qId = this.idGenerator.generate();

            // Create question
            const newQuestion = Question.create(
              qId,
              question?.answer,
              doc?.courseId,
              doc?.id,
              question?.explanation,
              question?.question
            );

            // Save Question
            const savedQuestion =
              await this.questionRepository.save(newQuestion);

            // create option
            const newOption = question?.options?.map(async (option) => {
              const newOption = Option.create(option.id, option.value, qId);
              const savedOption = await this.optionRepository.save(newOption);
            });
            return { ...savedQuestion, option: newOption };
          })
        );
      })
    );

    return result;
  }
}
