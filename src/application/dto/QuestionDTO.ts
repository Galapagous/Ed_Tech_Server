export interface CreateQuestion {
  courseId: string;
}

export interface QuestionResponseDTO {
  id: string;
  question: string;
  options: string[];
  answer: string;
  courseId: string;
  docId: string;
}
