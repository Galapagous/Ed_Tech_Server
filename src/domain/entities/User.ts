import { Email } from "../value-objects/Email";

export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly username: string,
    public readonly hashedPassword: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly isActive: boolean = true,
    public readonly token?: string
  ) {}

  public updateName(newName: string): User {
    if (!newName || newName.trim().length < 2) {
      throw new Error("Name must be at least two character long");
    }
    return new User(
      this.id,
      this.email,
      newName.trim(),
      this.hashedPassword,
      this.createdAt,
      new Date(),
      this.isActive
    );
  }

  public deactivateUser() {
    return new User(
      this.id,
      this.email,
      this.username,
      this.hashedPassword,
      this.createdAt,
      new Date(),
      false
    );
  }

  public static create(
    id: string,
    email: string,
    username: string,
    hashedPassword: string
  ): User {
    return new User(
      id,
      new Email(email).value,
      username,
      hashedPassword,
      new Date(),
      new Date(),
      true
    );
  }
}
