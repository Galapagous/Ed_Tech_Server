import { UserValidator } from "@/application/validators/UserValidator";

describe("User Service", () => {
  it("should validate user login credentials", async () => {
    const userData = {
      email: "test@gmail.com",
      password: "@Password1",
      username: "@testUser",
    };
    const userValidator = new UserValidator();
    const result = userValidator.validateCreateUser(userData);
    expect(result).toBeTruthy();
  });

  it("should reject invalid email", () => {
    const invalidData = {
      email: "not-an-email",
      password: "@Password1",
      username: "@testUser",
    };
    expect(() => new UserValidator().validateCreateUser(invalidData)).toThrow(
      /email/
    );
  });

  it("Should reject invalid password", () => {
    const userData = {
      email: "test@gmail.com",
      password: "strongPassword",
      username: "@testUser",
    };
    const userValidator = new UserValidator();
    expect(() => userValidator.validateCreateUser(userData)).toThrow(
      "Validation error: Password must contain at least one uppercase letter, one lowercase letter, and one number"
    );
  });
});
