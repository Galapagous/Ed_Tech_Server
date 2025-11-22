interface IOptions {
  id: string;
  value: string;
  question_id: string;
}
export class Question {
  constructor(
    public readonly id: string,
    public readonly question: string,
    public readonly options: IOptions[],
    public readonly answer: string,
    public readonly courseId: string,
    public readonly docId: string
  ) {}

  public create(
    id: string,
    question: string,
    options: IOptions[],
    answer: string,
    courseId: string,
    docId: string
  ) {
    if (!question || !options || !answer || !courseId || docId || !id) {
      throw new Error("Missing fields");
    }
    return new Question(
      this.id,
      this.question,
      this.options,
      this.answer,
      this.courseId,
      this.docId
    );
  }
}
