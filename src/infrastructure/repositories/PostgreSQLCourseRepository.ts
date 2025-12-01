import { Course } from "@/domain/entities/course";
import { CourseRepository } from "@/domain/repositories/CourseRepository";
import { Pool } from "pg";

export class PostgreSQLCourseRepository implements CourseRepository {
  constructor(private pool: Pool) {}

  async save(course: Course): Promise<Course> {
    const query = `INSERT INTO courses (id, title, description, created_at, updated_at, ownerId) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`;
    const values = [
      course.id,
      course.title,
      course.description,
      course.createdAt,
      course.updatedAt,
      course.ownerid,
    ];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findById(id: string): Promise<Course | null> {
    const query = `SELECT 
        *
        FROM courses
        WHERE id = $1
        `;
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return result.rows[0];
  }

  async findByOwner(id: string): Promise<Course[] | null> {
    const query = `SELECT 
        id,
        title,
        description,
        created_at,
        updated_at,
        ownerId
        FROM courses
        WHERE ownerId = $1
        `;
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return result.rows;
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM courses WHERE id = $1`;
    const result = await this.pool.query(query, [id]);
    return result.rows.length > 0;
  }

  async findAll(limit?: number, offset?: number): Promise<Course[]> {
    const query = `SELECT * FROM COURSES`;
    const result = await this.pool.query(query);
    return result.rows;
  }
}
