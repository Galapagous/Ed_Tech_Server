CREATE TABLE IF NOT EXISTS options (
  uid UUID PRIMARY KEY DEFAULT gen_random_uuid(),  
  id TEXT,         
  option_id TEXT NOT NULL,                               
  value TEXT NOT NULL,
  questionId UUID REFERENCES questions(id) ON DELETE CASCADE
);

CREATE INDEX idx_option_question_id ON options(questionId);
