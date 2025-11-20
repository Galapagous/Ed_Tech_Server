export interface IDoc {
  url: string;
  courseId: string;
  id: string;
}

export class Doc {
  constructor(
    public readonly url: string,
    public readonly courseId: string,
    public readonly id: string
  ) {}

  public static create(url: string, courseId: string, id: string): Doc {
    return new Doc(url, courseId, id);
  }
}
