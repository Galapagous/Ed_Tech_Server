import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import {
  GEMINIAI_URL,
  HUGGINGFACE_URL,
  OPENAI_URL,
} from "@/shared/api/endpoint";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { AI_fILE_PATH, AI_FOLDER_PATH } from "@/shared/others";

export interface IOption {
  id: string;
  value: string;
}

export interface IQuestion {
  question: string;
  options: IOption[];
  answer: string;
  explanation: string;
  difficulty?: string;
}

export enum AIProvider {
  OPENAI = "openai",
  GEMINI = "gemini",
  HUGGINGFACE = "huggingface",
}

enum QuestionCount {
  PRI = 10,
  SEC = 20,
  TER = 30,
}

export enum QuestionDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export interface AIResult {
  success: boolean;
  questions: IQuestion[];
  error: string | null;
}

export class AiService {
  private apiKey: string;
  private provider: AIProvider;
  private apiUrl: string;

  constructor(apiKey: string, provider: AIProvider) {
    this.apiKey = apiKey;
    this.provider = provider;
    this.apiUrl =
      provider === AIProvider.GEMINI
        ? GEMINIAI_URL
        : AIProvider.OPENAI
          ? OPENAI_URL
          : HUGGINGFACE_URL;
  }

  // -------------------------------------------------------------
  // PUBLIC API
  // -------------------------------------------------------------
  async generateQuestion(text: string): Promise<AIResult> {
    if (text.length < 80) {
      return {
        success: false,
        questions: [],
        error: "Text too short for meaningful questions",
      };
    }

    try {
      const prompt = this.buildPrompt(
        text,
        QuestionCount.PRI,
        QuestionDifficulty.HARD
      );

      const rawResponse = await this.callGemini(prompt);
      // const rawResponse =
      //   this.provider === AIProvider.GEMINI
      //     ? await this.callGemini(prompt)
      //     : this.provider === AIProvider.OPENAI
      //       ? await this.callOpenAI(prompt)
      //       : await this.huggigfaceCall(prompt);

      const questions = this.parseResponse(rawResponse);

      return {
        success: true,
        questions,
        error: null,
      };
    } catch (err: any) {
      return {
        success: false,
        questions: [],
        error: err?.message || "Failed to generate questions",
      };
    }
  }

  // -------------------------------------------------------------
  // PROMPT BUILDER
  // -------------------------------------------------------------
  private buildPrompt(
    text: string,
    count: number,
    difficulty: QuestionDifficulty
  ) {
    const guide = {
      easy: "Focus on direct facts and simple comprehension.",
      medium: "Require understanding and basic analysis.",
      hard: "Demand critical thinking and inference.",
    };

    return `
Generate ${count} high-quality multiple choice questions from the text.

TEXT:
""\"${text}""\"

REQUIREMENTS:
- Difficulty: ${guide[difficulty]}
- EXACTLY 4 options for each question (A, B, C, D).
- Provide correctIndex as the letter (A/B/C/D).
- Provide explanation.
- Provide difficulty ("easy", "medium", or "hard").

RETURN RESULT STRICTLY IN THIS JSON FORMAT:

[
  {
    "question": "string",
    "options": [
      { "id": "A", "value": "Option A text" },
      { "id": "B", "value": "Option B text" },
      { "id": "C", "value": "Option C text" },
      { "id": "D", "value": "Option D text" }
    ],
    "correctIndex": "A",
    "explanation": "string",
    "difficulty": "hard"
  }
]
    `.trim();
  }

  // -------------------------------------------------------------
  // API CALLS
  // -------------------------------------------------------------
  private async callOpenAI(prompt: string): Promise<string> {
    const url = "https://api.openai.com/v1/responses";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: prompt,
        max_output_tokens: 2000,
        temperature: 0.6,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenAI failed: ${response.status} => ${text}`);
    }

    const data: any = await response.json();

    return data.output_text || "";
  }

  private async callGemini(prompt: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: this.apiKey });
    const response: any = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
    });

    if (!response.text) throw new Error("Gemini failed: " + response.status);
    const data: any = await response?.text;
    const feedback = data.candidates?.[0]?.content?.parts?.[0]?.text || data;
    // write into a file
    await this.writeToFile(`gemini-response-${Date.now()}.txt`, feedback);
    return feedback;
  }

  private async huggigfaceCall(prompt: string): Promise<string> {
    const response = await fetch(this.apiUrl, {
      method: "POST",
      headers: { Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify({
        inputs: prompt,
      }),
    });

    if (!response.ok) throw new Error("Huggingface failed: " + response.status);

    const data: any = await response.json();
    return data[0].generated_text || "";
  }

  // -------------------------------------------------------------
  // RESPONSE PARSING
  // -------------------------------------------------------------
  private parseResponse(response: string): IQuestion[] {
    if (!response) return [];

    // 1. Try to extract ANY JSON array inside response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const arr = JSON.parse(jsonMatch[0]);
        const valid = arr.filter((q: any) => this.isValidQuestion(q));
        if (valid.length) return valid;
      } catch (err) {
        console.warn("JSON parsing failed — falling back to text parsing.");
      }
    }

    // 2. Fallback to text parser
    return this.parseTextFallback(response);
  }

  private isValidQuestion(q: any): q is IQuestion {
    return (
      q &&
      typeof q.question === "string" &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      typeof q.correctIndex === "string" &&
      ["A", "B", "C", "D"].includes(q.correctIndex.toUpperCase())
    );
  }

  // -------------------------------------------------------------
  // TEXT FALLBACK PARSER (VERY SMART)
  // -------------------------------------------------------------
  private parseTextFallback(text: string): IQuestion[] {
    const blocks = text
      .split(/(?:Question\s*\d+|^\d+\.)/i)
      .filter((x) => x.trim().length > 0);

    const parsed: IQuestion[] = [];

    for (const block of blocks) {
      const lines = block
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

      let question = "";
      const options: IOption[] = [];
      let correctLetter: string | null = null;
      let explanation = "";
      let difficulty: QuestionDifficulty = QuestionDifficulty.HARD;

      for (const line of lines) {
        // Question line
        if (!question && /[?]/.test(line)) {
          question = line.replace(/^["\s]*/, "").replace(/["\s]*$/, "");
          continue;
        }

        // Options: A), A., A:, (A) ...
        const optMatch = line.match(/^\(?([A-D])\)?[\)\.:]?\s*(.*)$/i);
        if (optMatch) {
          const id = optMatch[1].toUpperCase();
          let value = optMatch[2].trim();
          options.push({ id, value });
          continue;
        }

        // Correct answer: Answer: B OR Correct: C
        if (/answer/i.test(line)) {
          const match = line.match(/[A-D]/i);
          if (match) correctLetter = match[0].toUpperCase();
          continue;
        }

        // Explanation
        if (/explanation:/i.test(line)) {
          explanation = line.split(":")[1]?.trim() || "";
          continue;
        }

        // Difficulty
        if (/difficulty:/i.test(line)) {
          const diff = line.split(":")[1]?.trim()?.toLowerCase();
          if (["easy", "medium", "hard"].includes(diff))
            difficulty = diff as QuestionDifficulty;
        }
      }

      if (
        question &&
        options.length === 4 &&
        correctLetter &&
        ["A", "B", "C", "D"].includes(correctLetter)
      ) {
        parsed.push({
          question,
          options,
          answer: correctLetter,
          explanation:
            explanation ||
            `The correct answer is option ${correctLetter}: ${
              options.find((o) => o.id === correctLetter)?.value
            }`,
          difficulty,
        });
      }
    }

    return parsed;
  }

  // -------------------------------------------------------------
  // Write file
  // -------------------------------------------------------------
  private async ensureFolderExists(folderPath: string) {
    try {
      await mkdir(folderPath, { recursive: true });
    } catch (err) {
      console.error("Failed to create folder:", err);
      throw err;
    }
  }

  private async writeToFile(filename: string, data: string) {
    const folderPath = path.join(process.cwd(), AI_fILE_PATH, AI_FOLDER_PATH);
    this.ensureFolderExists(folderPath);

    const filePath = path.join(folderPath, filename);

    await writeFile(filePath, data, "utf-8");

    return filePath;
  }
}
