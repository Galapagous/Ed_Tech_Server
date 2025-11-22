import { Question } from "@/domain/entities/question";
import { GEMINIAI_URL, OPENAI_URL } from "@/shared/api/endpoint";

enum AIProvider {
  OPENAI = "openai",
  GEMINI = "gemini",
}

enum QuestionCount {
  PRI = 10,
  SEC = 20,
  TER = 30,
}

enum QuestionDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

class AiService {
  private apiKey: string;
  private apiUrl: string;

  constructor(apiKey: string, provider: AIProvider) {
    this.apiKey = apiKey;
    this.apiUrl =
      provider === AIProvider.GEMINI ? GEMINIAI_URL + apiKey : OPENAI_URL;
  }

  async generateQuestion(text: string) {
    try {
      if (text.length < 100) {
        return {
          Question: [],
          success: false,
          error: "Text too short for meaningfull questions",
        };
      }

      const prompt = this.buildPrompt(
        text,
        QuestionCount.PRI,
        QuestionDifficulty.HARD
      );
      const response = await this.callAPI(prompt);
      const questions = this.parseResponse(response as string);
    } catch (error) {}
  }

  private buildPrompt(text: string, count: number, difficulty: string): string {
    const difficultyGuide = {
      easy: "Focus on direct facts and simple comprehension",
      medium: "Require understanding and basic analysis",
      hard: "Demand critical thinking and inference",
    };
    return `create ${count} high-quality multiple choice questions from this text. Make them engaging and test real understanding.
    TEXT: "${text}"

    
    REQUIREMENTS FOR QUESTION GENERATION

    - Difficulty Level:
    * Generate questions at the following difficulty level:
    ${difficultyGuide[difficulty as keyof typeof difficultyGuide]}

    - Number of Options:
    * Each question must have exactly 4 answer options (A, B, C, D).

    - Quality of Questions:

    * Questions must test true comprehension, analysis, and understanding — not simple memorization.

    * Avoid trivial facts unless conceptually required.

    * Questions should evaluate the learner’s ability to interpret, analyze, or apply information from the provided PDF.

    - Distractor Quality:

    * Distractors must be plausible and contextually related, not random.

    * Only one option should be correct.

    * Ensure incorrect options reflect common misunderstandings or realistic alternatives.

    - Answer Explanations:
    * For each question, provide a brief but clear explanation of why the correct answer is correct and why the distractors are incorrect.
    
    
    FORMAT (JSON array):
    [
        {
            "question": "Clear, specific question?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctIndex": 0,
            "explanation": "Why this answer is correct",
            "difficulty": "easy|medium|hard"
        }
    ]

    Generate meaningful question that someone would actually want to answer.
    `;
  }

  private async callAPI(prompt: string): Promise<string> {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAi API failed: ${response.status}`);
    }

    const data: any = await response.json();
    return data.choices[0].message.content;
  }

  private async callGemini(prompt: string): Promise<string> {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API failed: ${response.status}`);
    }

    const data: any = await response.json();
    return data.candidates[0].content.parts[0].text;
  }

  private parseResponse(response: string): Question[] {
    try {
      // Try to extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        return questions.filter(this.isValidQuestion);
      }
    } catch (error) {
      console.warn("Failed to parse JSON, trying text parsing");
    }

    // Fallback to text parsing if JSON fails
    return this.parseTextResponse(response);
  }

  private isValidQuestion = (q: any): q is Question => {
    return (
      q &&
      typeof q.question === "string" &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctIndex === "number" &&
      q.correctIndex >= 0 &&
      q.correctIndex < 4
    );
  };

  private parseTextResponse(text: string): Question[] {
    const questions: Question[] = [];
    const blocks = text
      .split(/(?:Question\s*\d+|^\d+\.)/i)
      .filter((b) => b.trim());

    for (const block of blocks) {
      const lines = block
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      let question = "";
      const options: string[] = [];
      let correctIndex = -1;
      let explanation = "";
      let difficulty: QuestionDifficulty.HARD;

      for (const line of lines) {
        if (line.includes("?") && !line.match(/^[A-D]\)/)) {
          question = line.replace(/^["\s]*/, "").replace(/["\s]*$/, "");
        } else if (line.match(/^[A-D]\)/)) {
          options.push(line.substring(3).trim());
        } else if (line.toLowerCase().includes("answer:")) {
          const match = line.match(/[A-D]/i);
          if (match) {
            correctIndex = match[0].toUpperCase().charCodeAt(0) - 65;
          }
        } else if (line.toLowerCase().includes("explanation:")) {
          explanation = line.split(":")[1]?.trim() || "";
        } else if (line.toLowerCase().includes("difficulty:")) {
          const diff = line.split(":")[1]?.trim().toLowerCase();
          if (["easy", "medium", "hard"].includes(diff || "")) {
            difficulty = diff as QuestionDifficulty.HARD;
          }
        }
      }

      if (question && options.length === 4 && correctIndex >= 0) {
        questions.push({
          question,
          options,
          correctIndex,
          explanation:
            explanation || `The correct answer is ${options[correctIndex]}`,
          difficulty: QuestionDifficulty.HARD,
        });
      }
    }

    return questions;
  }
}
