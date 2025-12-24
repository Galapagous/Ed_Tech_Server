import { Answer } from "../entities/answer";

export interface Answerrepository {
  save(answer: Answer): Promise<Answer>;
  findByAttemptId(id: string): Promise<Answer[] | []>;
}
