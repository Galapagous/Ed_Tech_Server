import { Pool } from "pg";
import { User } from "../../domain/entities/User";
import { Email } from "../../domain/value-objects/Email";
import { UserRepository } from "@/domain/repositories/UserRepository";

export class PostgreSQLUserRepository implements UserRepository {
  constructor(private pool: Pool) {}

  async save(user: User): Promise<User> {
    const query = `INSERT INTO users (id, email, username, password, created_at, updated_at, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;

    const values = [
      user.id,
      user.email,
      user.username,
      user.hashedPassword,
      user.createdAt,
      user.updatedAt,
      user.isActive,
    ];

    const result = await this.pool.query(query, values);
    return this.mapRowToUser(result.rows[0]);
  }

  async findById(id: string): Promise<User | null> {
    const query = `SELECT 1 FROM users WHERE id = $1`;
    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return this.mapRowToUser(result.rows[0]);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const query = `
    SELECT 
      id,
      email,
      username,
      password AS "hashedPassword",
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      is_active AS "isActive"
    FROM users
    WHERE email = $1
  `;
    const result = await this.pool.query(query, [email.value]);
    if (result.rows.length === 0) return null;
    // console.log("row", result);
    return this.mapRowToUser(result.rows[0]);
  }

  async findAll(limit?: number, offset?: number): Promise<User[]> {
    const query = `SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2`;
    const result = await this.pool.query(query, [limit, offset]);
    return result.rows.map((row) => this.mapRowToUser(row));
  }

  async update(user: User): Promise<User> {
    const values = [
      user.id,
      user.email,
      user.username,
      user.updatedAt,
      user.isActive,
    ];
    const query = `
        UPDATE users SET email = $2, username = $3, updatedAt = $4, isActive = $5 WHERE id = $1`;
    const result = await this.pool.query(query, values);
    return this.mapRowToUser(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM users WHERE id = $1`;
    await this.pool.query(query, [id]);
  }

  async exists(id: string): Promise<boolean> {
    const query = `SELECT 1 FROM users WHERE id = $1`;
    const result = await this.pool.query(query, [id]);
    return result.rows.length > 0;
  }

  private mapRowToUser(row: any): User {
    return new User(
      row.id,
      row.email,
      row.username,
      row.hashedPassword,
      row.createdAt,
      row.updatedAt,
      row.isActive
    );
  }
}
