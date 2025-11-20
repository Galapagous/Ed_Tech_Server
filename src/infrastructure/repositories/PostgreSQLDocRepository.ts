import { Doc } from "@/domain/entities/doc";
import { DocRepository } from "@/domain/repositories/DocRepository";
import { Pool } from "pg";

export class PostgesSQLDocrepository implements DocRepository {
  constructor(private pool: Pool) {}

  async save(doc: Doc): Promise<Doc> {
    const query = `INSERT INTO docs (url, courseId, id) VALUES ($1, $2, $3) RETURNING *`;
    const values = [doc.url, doc.courseId, doc.id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findById(id: string): Promise<Doc | null> {
    const query = `SELECT 
      id,
      url,
      courseId
      FROM docs
      WHERE id = $1
      `;
    const value = [id];
    const result = await this.pool.query(query, value);
    return result.rows[0];
  }

  async findByCourseId(courseid: string): Promise<Doc[] | null> {
    const query = `SELECT
      id,
      url,
      courseId
      FROM docs
      WHERE courseId = $1
      `;
    const value = [courseid];
    const result = await this.pool.query(query, value);
    if (result.rows.length === 0) return null;
    return result.rows;
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM docs WHERE id = $1`;
    const result = await this.pool.query(query, [id]);
    return result.rows.length > 0;
  }
}
