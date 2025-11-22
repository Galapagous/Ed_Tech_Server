import { CreateCourse } from "@/application/dto/CourseDTOs";
import {
  CreateQuestion,
  QuestionResponseDTO,
} from "@/application/dto/QuestionDTO";
import { IdGenerator } from "@/application/interfaces/IdGenerator";
import { IDoc } from "@/domain/entities/doc";
import { DocRepository } from "@/domain/repositories/DocRepository";
import { QuestionRepository } from "@/domain/repositories/QuestionRepository";
import { generatePDF } from "@/infrastructure/services/PDFParser";

export class CreateQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private idGenerator: IdGenerator,
    private docRepository: DocRepository
  ) {}

  async execute(dto: string): Promise<QuestionResponseDTO> {
    const id = this.idGenerator.generate();
    const docs: IDoc[] | null = await this.docRepository.findByCourseId(dto);
    // pdf parser to get pdf doc
    if (docs === null) throw new Error("No document found, upload to continue");
    const pdf = await docs.map((doc: IDoc) => generatePDF(doc.url));
    // generate quest and ans from ai prompt

    console.log("pdf documents -->", pdf);
    // save options with questionId

    // save quest with course id and docId

    return this.questionRepository.save(questions);
  }
}
