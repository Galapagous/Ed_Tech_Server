import { createApp } from "./app";
import dotenv from "dotenv";
import { MigrationRunner } from "./infrastructure/database/migrations/runMigration";
dotenv.config();

const PORT = process.env.PORT || 3000;

const app = createApp();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
