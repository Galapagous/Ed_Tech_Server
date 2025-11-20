import request from "supertest";
import { createApp } from "@/app";
// import { Pool } from "pg";
import { DatabaseConnection } from "@/infrastructure/database/connection";

// const dbPool = (global as any).__DB__ as Pool;
const pool2 = DatabaseConnection.getInstance().getPool();

describe("Auth route integration", () => {
  let app: any;

  beforeAll(() => {
    process.env.DB_HOST = "localhost";
    process.env.DB_PORT = "5432";
    process.env.DB_USER = "ubuntu";
    process.env.DB_PASSWORD = "iamwhatiam";
    process.env.DB_NAME = "testdb";

    app = createApp();
  });

  // afterAll(() => {
  //   // Optional: Reset env for other tests (if needed)
  //   // process.env.DB_NAME = "myapp";  // Or delete process.env.DB_NAME;
  // });

  it("Should create a new user via post /api/users", async () => {
    const userData = {
      email: "user2@example.com",
      username: "@user2",
      password: "@Password1",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData)
      .expect(201)
      .expect((res: any) => {
        expect(res._body.data.email).toBe(userData.email);
        expect(res._body.data.id).toBeDefined();
        expect(res._body.data.username).toBe(userData.username);
      });

    // Verify insert in test DB
    const dbResult = await pool2.query("SELECT * FROM users WHERE email = $1", [
      userData.email,
    ]);
    expect(dbResult.rows.length).toBe(1);
    expect(dbResult.rows[0].email).toBe(userData.email);
    expect(dbResult.rows[0].password).toBeDefined();
  }, 10000);

  it("Should login user via posy /api/auth/login", async () => {
    const userData = {
      email: "user3@example.com",
      password: "@Password1",
    };
    const response = await request(app)
      .post("/api/auth/login")
      .send(userData)
      .expect(200)
      .expect((res: any) => {
        expect(res._body.data.email).toBe(userData.email);
        expect(res._body.data.id).toBeDefined();
        expect(res._body.data.token).toBeDefined();
      });
  });
});

afterEach(async () => {
  await pool2.query("DELETE FROM users WHERE email = 'user2@example.com'");
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // Drain
});
