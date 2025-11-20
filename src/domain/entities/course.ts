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
    public readonly ownerid: string
  ) {}

  // public update(doc: IDoc): Course {
  //   if (!doc) {
  //     throw new Error("No file uploaded");
  //   }
  //   return new Course(
  //     this.id,
  //     this.title,
  //     this.description,
  //     this.createdAt,
  //     new Date(),
  //     this.ownerid
  //   );
  // }

  public static create(
    id: string,
    title: string,
    description: string,
    ownerId: string
  ): Course {
    return new Course(id, title, description, new Date(), new Date(), ownerId);
  }
}
