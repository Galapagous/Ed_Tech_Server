import { Question } from "@/domain/entities/question";
import { QuestionRepository } from "@/domain/repositories/QuestionRepository";
import { Pool } from "pg";

export class PostgreSQLQuestionRepository implements QuestionRepository {
  constructor(private pool: Pool) {}

  async save(question: Question): Promise<Question> {
    const query = `INSERT INTO questions (id, question, answer, explanation, courseId, docId)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`;
    const values = [
      question.id,
      question.question,
      question.answer,
      question.explanation,
      question.courseId,
      question.docId,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByCourse(id: string): Promise<Question[] | null> {
    const query = `SELECT
    id,
    question,
    docId
    FROM questions
    WHERE courseId = $1
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows;
  }

  async findById(id: string): Promise<Question | null> {
    const query = `SELECT 
    id,
    answer,
    question
    FROM questions
    WHERE id = $1
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows[0] || null;
  }
}
