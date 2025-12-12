import { Result } from "@/domain/entities/result";
import { ResultRepository } from "@/domain/repositories/ResultRepository";
import { Pool } from "pg";

export class PostgresResultRepository implements ResultRepository {
  constructor(private pool: Pool) {}

  async save(resultDTO: Result): Promise<Result> {
    const query = `INSERT INTO results (id, courseId, score)`;
    const values = [
      resultDTO.id,
      resultDTO.courseId,
      resultDTO.score,
      resultDTO.createdAt,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByAttempt(attemptId: string): Promise<Result[]> {
    const query = `SELECT * FROM results WHERE id = $1`;
    const result = await this.pool.query(query, [attemptId]);
    return result.rows;
  }
}
