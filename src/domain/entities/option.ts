export class Option {
  constructor(
    public readonly id: string,
    public readonly value: string,
    public readonly question_id: string
  ) {}

  public static create(id: string, value: string, question_id: string) {
    if (!id || !value || !question_id) throw new Error("Missing fields");
    return new Option(id, value, question_id);
  }
}
