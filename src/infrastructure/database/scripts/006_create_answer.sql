CREATE TABLE IF NOT EXISTS answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionId UUID REFERENCES questions(id) ON DELETE CASCADE,
    optionId TEXT NOT NULL,
    attemptId TEXT NOT NULL,
    isCorrect boolean DEFAULT FALSE
);

CREATE INDEX idx_answers_id ON answers(questionId);