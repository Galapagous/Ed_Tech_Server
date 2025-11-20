import { Pool } from "pg";
import fs from "fs";
import path from "path";

export class MigrationRunner {
  constructor(private pool: Pool) {}

  async runMigrations() {
    try {
      await this.pool.query(`
        CREATE TABLE IF NOT EXISTS migrations (
          id SERIAL PRIMARY KEY,
          name VARCHAR(255) NOT NULL UNIQUE,
          executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Get all migration files
      const migrationsDir = path.join(__dirname, "../scripts");
      const files = fs.readdirSync(migrationsDir).sort();

      for (const file of files) {
        // Check if migration already ran
        const { rows } = await this.pool.query(
          "SELECT * FROM migrations WHERE name = $1",
          [file]
        );

        if (rows.length === 0) {
          console.log(`Running migration: ${file}`);
          const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");

          await this.pool.query("BEGIN");
          try {
            await this.pool.query(sql);
            await this.pool.query("INSERT INTO migrations (name) VALUES ($1)", [
              file,
            ]);
            await this.pool.query("COMMIT");
            console.log(`✓ Migration ${file} completed`);
          } catch (error) {
            await this.pool.query("ROLLBACK");
            throw error;
          }
        }
      }

      console.log("All migrations completed");
    } catch (error) {
      console.error("Migration error:", error);
      throw error;
    }
  }
}
