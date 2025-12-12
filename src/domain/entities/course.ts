// export interface IDoc {
//   url: string;
//   courseId: string;
//   id: string;
// }
export class Course {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly ownerid: string,
    public readonly filePath: string
  ) {}

  public static create(
    id: string,
    title: string,
    description: string,
    ownerId: string,
    filePath: string | null
  ): Course {
    return new Course(
      id,
      title,
      description,
      new Date(),
      new Date(),
      ownerId,
      filePath || ""
    );
  }
}
