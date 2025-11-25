import { Question } from "@/domain/entities/question";
import { QuestionRepository } from "@/domain/repositories/QuestionRepository";
import { Pool } from "pg";

export class PostgreSQLQuestionRepository implements QuestionRepository {
  constructor(private pool: Pool) {}

  async save(question: Question): Promise<Question> {
    const query = `INSERT INTO questions (id, question, answer, explanation, docId)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`;
    const values = [
      question.id,
      question.question,
      question.answer,
      question.explanation,
      question.docId,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByCourse(id: string): Promise<Question[] | null> {
    const query = `SELECT
      id,
      question,
      answer,
      explanation,
      docId
      FROM questions
      WHERE id = $1
      `;
    const result = await this.pool.query(query, [id]);
    if (result.rows[0].length === 0) return null;
    return result.rows[0];
  }
}
