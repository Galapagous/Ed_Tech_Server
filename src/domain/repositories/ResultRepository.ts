import { Result } from "../entities/result";

export interface ResultRepository {
  save(result: Result): Promise<Result>;
  findByAttempt(attemptId: string): Promise<Result[]>;
}
