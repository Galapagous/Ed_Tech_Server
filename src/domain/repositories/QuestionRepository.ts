import { Question } from "../entities/question";

export interface QuestionRepository {
  save(question: Question): Promise<Question>;
  findByCourse(id: string): Promise<Question[] | null>;
}
