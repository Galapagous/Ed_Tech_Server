import { Answer } from "../entities/answer";

export interface AnswerRepository {
  save(answer: Answer): Promise<Answer>;
  findByAttemptId(id: string): Promise<Answer[] | []>;
}
