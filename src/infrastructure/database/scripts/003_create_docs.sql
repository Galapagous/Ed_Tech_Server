CREATE TABLE IF NOT EXISTS docs (
  id UUID PRIMARY KEY,
  url TEXT NOT NULL,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE
);

CREATE INDEX idx_doc_course_id ON docs(course_id);