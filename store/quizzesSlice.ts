import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number | number[]; // index or array for multiple correct
  type: 'single' | 'multiple';
  explanation?: string;
}

export interface Quiz {
  id: number;
  title: string;
  duration: number; // minutes
  questions: QuizQuestion[];
  totalMarks: number;
  attempt?: {
    id: number;
    startTime: string;
    endTime?: string;
    answers: { questionId: number; answer: number | number[] }[];
    score?: number;
    correctCount?: number;
    incorrectCount?: number;
    submitted: boolean;
  };
}

const dummyQuizzes: Quiz[] = [
  {
    id: 1,
    title: 'React Fundamentals',
    duration: 45,
    totalMarks: 50,
    questions: [
      {
        id: 1,
        text: 'What is React?',
        options: ['Library', 'Framework', 'Language', 'Database'],
        correctAnswer: 0,
        type: 'single',
        explanation: 'React is a JavaScript library for building user interfaces.',
      },
      {
        id: 2,
        text: 'Which of the following are hooks?',
        options: ['useState', 'useEffect', 'useReducer', 'useRef'],
        correctAnswer: [0,1,2,3],
        type: 'multiple',
        explanation: 'All four are built-in React hooks.',
      },
    ],
  },
  // more...
];

interface QuizzesState {
  quizzes: Quiz[];
  // derived stats for dashboard
  averageScore?: number;
}

const initialState: QuizzesState = {
  quizzes: dummyQuizzes,
};

const quizzesSlice = createSlice({
  name: 'quizzes',
  initialState,
  reducers: {
    startQuiz: (state, action: PayloadAction<{ quizId: number }>) => {
      const quiz = state.quizzes.find(q => q.id === action.payload.quizId);
      if (quiz && !quiz.attempt) {
        quiz.attempt = {
          id: Date.now(),
          startTime: new Date().toISOString(),
          answers: [],
          submitted: false,
        };
      }
    },
    answerQuestion: (state, action: PayloadAction<{ quizId: number; questionId: number; answer: number | number[] }>) => {
      const quiz = state.quizzes.find(q => q.id === action.payload.quizId);
      if (quiz?.attempt && !quiz.attempt.submitted) {
        const existing = quiz.attempt.answers.find(a => a.questionId === action.payload.questionId);
        if (existing) existing.answer = action.payload.answer;
        else quiz.attempt.answers.push({ questionId: action.payload.questionId, answer: action.payload.answer });
      }
    },
    submitQuiz: (state, action: PayloadAction<{ quizId: number }>) => {
      const quiz = state.quizzes.find(q => q.id === action.payload.quizId);
      if (!quiz?.attempt || quiz.attempt.submitted) return;

      let correct = 0;
      for (const answer of quiz.attempt.answers) {
        const question = quiz.questions.find(q => q.id === answer.questionId);
        if (!question) continue;
        if (question.type === 'single') {
          if (answer.answer === question.correctAnswer) correct++;
        } else {
          // multiple: compare arrays (order independent)
          const correctAnswers = question.correctAnswer as number[];
          const userAnswers = answer.answer as number[];
          if (correctAnswers.length === userAnswers.length && correctAnswers.every(v => userAnswers.includes(v))) correct++;
        }
      }
      const score = (correct / quiz.questions.length) * 100;
      quiz.attempt.endTime = new Date().toISOString();
      quiz.attempt.score = score;
      quiz.attempt.correctCount = correct;
      quiz.attempt.incorrectCount = quiz.questions.length - correct;
      quiz.attempt.submitted = true;
    },
  },
});

export const { startQuiz, answerQuestion, submitQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;