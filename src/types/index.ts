export enum QuestionType {
  MultipleChoice = 'multiple_choice',
  MultipleSelection = 'multiple_selection',
  TrueFalse = 'true_false',
  ShortAnswer = 'short_answer',
  FileUpload = 'file_upload'
}

export interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  options: Option[];
  required: boolean;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  questions: Question[];
}

export interface QuizSubmission {
  id: string;
  quizId: string;
  submittedAt: string;
  answers: Answer[];
  score?: number;
  maxScore?: number;
}

export interface Answer {
  questionId: string;
  value: string | string[] | File | null;
}

export interface AppState {
  quizzes: Quiz[];
  submissions: QuizSubmission[];
}
