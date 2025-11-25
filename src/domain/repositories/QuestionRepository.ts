import { Option } from "../entities/option";
import { Question } from "../entities/question";

export interface QuestionRepository {
  save(question: Question): Promise<Question>;
  findByCourse(id: string): Promise<Question[] | null>;
}

export interface OptionRepository {
  save(option: Option): Promise<Option>;
  findByQuestion(id: string): Promise<Option[] | null>;
}

