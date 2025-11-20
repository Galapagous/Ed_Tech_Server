export class Email {
  private readonly _value: string;

  constructor(email: string) {
    if (!this.isValid(email)) {
      throw new Error("Invalid email format");
    }
    this._value = email.toLocaleLowerCase();
  }

  get value(): string {
    return this._value;
  }

  private isValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }
}
