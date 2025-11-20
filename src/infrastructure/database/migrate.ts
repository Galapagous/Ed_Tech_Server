// import { Pool } from "pg";

// async function runMigrations(pool: Pool) {
//   const client = await pool.connect();
//   try {
//     // Create users table (example)
//     await client.query(`
//       CREATE TABLE IF NOT EXISTS users (
//         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//         email VARCHAR(255) UNIQUE NOT NULL,
//         password VARCHAR(255) NOT NULL,
//         username VARCHAR(255) NOT NULL,
//         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
//       );
//     `);
//     // Add more tables/queries here

//     console.log("Migrations applied!");
//   } finally {
//     client.release();
//   }
// }

// // For CLI: If run directly
// if (require.main === module) {
//   const pool = new Pool({
//     host: process.env.DB_HOST || "localhost",
//     port: Number(process.env.DB_PORT) || 5432,
//     user: process.env.DB_USER || "postgres",
//     password: process.env.DB_PASSWORD || "iamwhatiam",
//     database: process.env.DB_NAME || "postgres",
//   });
//   runMigrations(pool)
//     .then(() => pool.end())
//     .catch(console.error);
// }

// export { runMigrations };

// === v2 ===
import { Pool } from "pg";
import "dotenv/config"; // For env loading

async function runMigrations(pool: Pool) {
  const client = await pool.connect();
  try {
    // Create table if not exists (base schema)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Add username column if missing (idempotent upgrade)
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'username'
        ) THEN
          ALTER TABLE users ADD COLUMN username VARCHAR(255) UNIQUE NOT NULL DEFAULT '';
          -- Note: DEFAULT '' for existing rows; update if needed (e.g., for new users only)
        END IF;
      END $$;
    `);
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'updated_at'
        ) THEN
          ALTER TABLE users ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
          -- Note: DEFAULT '' for existing rows; update if needed (e.g., for new users only)
        END IF;
      END $$;
    `);
    await client.query(`
      DO $$ 
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'users' AND column_name = 'is_active'
        ) THEN
          ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
          -- Note: DEFAULT '' for existing rows; update if needed (e.g., for new users only)
        END IF;
      END $$;
    `);

    // Optional: Enable UUID extension if not already (for gen_random_uuid)
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    console.log("Migrations applied!");
  } finally {
    client.release();
  }
}

// CLI block (unchanged for CommonJS)
if (require.main === module) {
  const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "iamwhatiam",
    database: process.env.DB_NAME || "postgres",
  });
  runMigrations(pool)
    .then(() => pool.end())
    .catch(console.error);
}

export { runMigrations };
