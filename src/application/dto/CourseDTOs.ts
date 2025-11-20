export interface CreateCourse {
  title: string;
  description: string;
  ownerId: string;
}

export interface CourseResponseDTO {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  ownerid: string;
}
