CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  explanation TEXT,
  courseId UUID REFERENCES courses(id) ON DELETE CASCADE,
  docId UUID REFERENCES docs(id) ON DELETE CASCADE
);
CREATE INDEX idx_question_course_id ON questions(courseId);