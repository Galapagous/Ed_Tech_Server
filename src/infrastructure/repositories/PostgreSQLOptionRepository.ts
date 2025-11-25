import { Option } from "@/domain/entities/option";
import { OptionRepository } from "@/domain/repositories/QuestionRepository";
import { Pool } from "pg";

export class PostgreSQLOptionRepository implements OptionRepository {
  constructor(private pool: Pool) {}

  async save(option: Option): Promise<Option> {
    const query = `INSERT INTO options (id, value, question_id)
        VALUES($1, $2, $3)
        RETURNING *`;
    const values = [option.id, option.value, option.question_id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findByQuestion(id: string): Promise<Option[] | null> {
    const query = `SELECT
      id,
      value,
      question_id
      FROM options
      WHERE question_id = $1
      `;
    const result = await this.pool.query(query, [id]);
    if (result.rows[0].length === 0) return null;
    return result.rows[0];
  }
}
