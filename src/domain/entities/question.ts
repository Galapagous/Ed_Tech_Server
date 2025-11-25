export interface IOptions {
  id: string;
  value: string;
  question_id: string;
}
export class Question {
  constructor(
    public readonly id: string,
    public readonly question: string,
    // public readonly options: IOptions[],
    public readonly answer: string,
    public readonly explanation: string,
    public readonly courseId: string,
    public readonly docId: string
  ) {}

  public static create(
    id: string,
    question: string,
    // options: IOptions[],
    answer: string,
    explanation: string,
    courseId: string,
    docId: string
  ) {
    if (!question || !answer || !courseId || docId || !id) {
      throw new Error("Missing fields");
    }
    return new Question(
      id,
      question,
      // this.options,
      answer,
      explanation,
      courseId,
      docId
    );
  }
}
