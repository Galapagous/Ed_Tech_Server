import { Answer } from "@/domain/entities/answer";
import { AnswerRepository } from "@/domain/repositories/AnswerRepository";
import { Pool } from "pg";

export class PostgresAnserRepository implements AnswerRepository {
  constructor(private pool: Pool) {}

  async save(answer: Answer): Promise<Answer> {
    const query = `
    INSERT INTO answers (id, questionId, optionId, attemptId, isCorrect)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

    const values = [
      answer.id,
      answer.questionId,
      answer.optionId,
      answer.attemptId,
      answer.isCorrect,
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByAttemptId(id: string): Promise<Answer[] | []> {
    const query = `SELECT * FROM answers WHERE attemptId = $1`;
    const result = await this.pool.query(query, [id]);
    return result.rows;
  }
}
