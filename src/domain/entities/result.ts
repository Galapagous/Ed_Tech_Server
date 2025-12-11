export class Result {
  constructor(
    public readonly id: string,
    public readonly attemptId: string,
    public readonly score: string,
    public readonly courseId: string,
    public readonly createdAt: Date
  ) {}
  public static create(
    id: string,
    attemptId: string,
    courseId: string,
    score: string
  ): Result {
    return new Result(id, attemptId, courseId, score, new Date());
  }
}
