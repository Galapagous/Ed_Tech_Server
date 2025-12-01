export class Option {
  constructor(
    public readonly id: string,
    public readonly value: string,
    public readonly question_id: string,
    public readonly option_id: string
  ) {}

  public static create({
    id,
    value,
    question_id,
    option_id,
  }: {
    id: string;
    value: string;
    question_id: string;
    option_id: string;
  }): Option {
    if (!id || !value || !question_id || !option_id)
      throw new Error("Missing fields");
    return new Option(id, value, question_id, option_id);
  }
}
