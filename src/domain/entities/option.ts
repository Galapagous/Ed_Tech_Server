export class Option {
  constructor(
    public readonly id: string,
    public readonly value: string,
    public readonly question_id: string
  ) {}

  public create(id: string, value: string, question_id: string) {
    if (!id || !value || !question_id) throw new Error("Missing fields");
    return new Option(this.id, this.value, this.question_id);
  }
}
