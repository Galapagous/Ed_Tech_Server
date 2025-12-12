export class Result {
  constructor(
    public readonly id: string,
    public readonly score: string,
    public readonly courseId: string,
    public readonly createdAt: Date
  ) {}
  public static create(id: string, courseId: string, score: string): Result {
    return new Result(id, courseId, score, new Date());
  }
}
