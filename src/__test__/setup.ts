// import {
//   PostgreSqlContainer,
//   StartedPostgreSqlContainer,
// } from "@testcontainers/postgresql";
// import { Pool } from "pg";

// let container: StartedPostgreSqlContainer;
// let pool: Pool;

// beforeAll(async () => {
//   // Define and start container
//   container = await new PostgreSqlContainer("postgres:16-alpine")
//     .withDatabase("testdb")
//     .withUsername("testuser")
//     .withPassword("testpass")
//     .start();

//   // Connect pg client
//   pool = new Pool({
//     host: container.getHost(),
//     port: container.getPort(),
//     user: container.getUsername(),
//     password: container.getPassword(),
//     database: container.getDatabase(),
//   });

//   (global as any).__DB__ = pool;
// });

// afterAll(async () => {
//   await pool.end();
//   await container.stop();
// });

// == v2 ==
import { Pool } from "pg";
import { spawnSync } from "child_process"; // For running the migrate script
import path from "path";
import { runMigrations } from "@/infrastructure/database/migrate";

let pool: Pool;

beforeAll(async () => {
  pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "ubuntu", // Your DB user
    password: "iamwhatiam", // Replace with your actual password
    database: "testdb",
  });

  // Test connection
  await pool.query("SELECT 1");
  console.log("Test DB connected!");

  await runMigrations(pool);
  console.log("Migrations run!");

  // Run migrations: Option 1 - Exec the script with test env (easiest if migrate.js uses process.env)
  const migratePath = path.join(
    __dirname,
    "../../../server/dist/infrastructure/database/migrate.js"
  );
  const env = {
    ...process.env,
    NODE_ENV: "test",
    DB_HOST: "localhost",
    DB_PORT: "5432",
    DB_USER: "ubuntu",
    DB_PASSWORD: "iamwhatiam",
    DB_NAME: "testdb",
  };
  const result = spawnSync("node", [migratePath], { stdio: "inherit", env });
  if (result.error || result.status !== 0) {
    throw new Error(`Migration failed: ${result.stderr?.toString()}`);
  }
  console.log("Migrations run!");

  // Alternative: Option 2 - If you have a modular migrate function, import and call it
  // import { runMigrations } from '@/infrastructure/database/migrate';  // Adjust path
  // await runMigrations(pool);

  (global as any).__DB__ = pool;
});

afterAll(async () => {
  await pool.end();
});

beforeEach(async () => {
  // Now safe to truncate—tables exist
  await pool.query("TRUNCATE TABLE users CASCADE;"); // Add other tables: , other_table
  // Or for full reset: await pool.query('TRUNCATE SCHEMA public AND COMMIT;'); then re-run schema if needed
});
