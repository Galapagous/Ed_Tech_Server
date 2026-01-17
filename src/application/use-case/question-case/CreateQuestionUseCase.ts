import { IdGenerator } from "@/application/interfaces/IdGenerator";
import { Option } from "@/domain/entities/option";
import { Question } from "@/domain/entities/question";
import { CourseRepository } from "@/domain/repositories/CourseRepository";
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
import { AI_fILE_PATH, AI_FOLDER_PATH } from "@/shared/others";
import fs from "fs";
import path from "path";

export class CreateQuestionUseCase {
  constructor(
    private questionRepository: QuestionRepository,
    private optionRepository: OptionRepository,
    private idGenerator: IdGenerator,
    private docRepository: DocRepository,
    private aiGenerator: AiService,
    private courseRepository: CourseRepository
  ) {}

  async execute(dto: string): Promise<any> {
    // get course
    const course = await this.courseRepository.findById(dto);
    if (course === null) throw new Error("Course not found");

    let result = null;
    let questions = null;

    const docs = await this.docRepository.findByCourseId(dto);
    if (!docs || docs.length === 0) {
      throw new Error("No documents found for this course");
    }

    // console.log("docs is ==>", docs, "course ==>", course);

    if (
      course?.filePath === "" ||
      course?.filePath === null ||
      course?.filePath === undefined
    ) {
      // =====> Generate new one <=====
      // console.log("decided ==> creating new path");
      const pdfText = await Promise.all(
        docs.map(async (doc) => await generatePDF(doc.url))
      );
      console.log("done creating ==>", pdfText);
      questions = await this.aiGenerator.generateQuestion(
        pdfText.join("--------- > End of document <-----------")
      );
    } else {
      // =====> Extract from txt file <=====
      console.log("Else is running ==> checking old path");
      const url = path.join(
        process.cwd(),
        AI_fILE_PATH,
        AI_FOLDER_PATH,
        `${course.filePath}.txt`
      );
      const dataString = await fs.promises.readFile(url, "utf-8");

      let cleaned = dataString
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      try {
        questions = await JSON.parse(cleaned);
      } catch (err) {
        throw new Error("Invalid JSON format in AI file");
      }
    }

    if (!questions) {
      throw new Error("Error Generating question");
    }

    // Normalize questions - handle both array and object with questions property
    const questionsList = Array.isArray(questions)
      ? questions
      : questions.questions || [];

    if (questionsList.length === 0) {
      throw new Error("No questions found in the generated data");
    }
    result = await Promise.all(
      questionsList.map(async (question: any) => {
        const qId = this.idGenerator.generate();

        // Create and save question
        const newQuestion = await Question.create({
          id: qId,
          question: question?.question,
          answer: question?.correctIndex,
          explanation: question?.explanation,
          courseId: course.id,
          docId: docs[0]?.id,
        });

        const savedQuestion = await this.questionRepository.save(newQuestion);

        // Create and save options
        const savedOptions = await Promise.all(
          (question.options || []).map(async (option: any) => {
            const optionId = this.idGenerator.generate();
            const newOption = Option.create({
              id: optionId,
              question_id: qId,
              option_id: option.id,
              value: option.value,
            });
            return await this.optionRepository.save(newOption);
          })
        );

        return {
          savedQuestion,
          options: savedOptions,
        };
      })
    );

    return result;
  }
}
