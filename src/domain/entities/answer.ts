import { attempt } from "joi";

export class Answer {
  constructor(
    public readonly id: string,
    public readonly questionId: string,
    public readonly optionId: string,
    public readonly attemptId: string,
    public readonly isCorrect: boolean
  ) {}

  public static create(
    id: string,
    questionId: string,
    optionId: string,
    attemptId: string,
    isCorrect: boolean
  ): Answer {
    return new Answer(id, questionId, optionId, attemptId, isCorrect);
  }
}
