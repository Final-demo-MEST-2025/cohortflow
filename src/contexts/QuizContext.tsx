import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';
import { AppState, Quiz, QuizSubmission } from '../types';

// Initial state
const initialState: AppState = {
  quizzes: [],
  submissions: []
};

// Actions
type Action =
  | { type: 'ADD_QUIZ'; payload: Quiz }
  | { type: 'DELETE_QUIZ'; payload: string }
  | { type: 'UPDATE_QUIZ'; payload: Quiz }
  | { type: 'ADD_SUBMISSION'; payload: QuizSubmission };

// Reducer
function quizReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_QUIZ':
      return {
        ...state,
        quizzes: [...state.quizzes, action.payload]
      };
    case 'DELETE_QUIZ':
      return {
        ...state,
        quizzes: state.quizzes.filter(quiz => quiz.id !== action.payload)
      };
    case 'UPDATE_QUIZ':
      return {
        ...state,
        quizzes: state.quizzes.map(quiz =>
          quiz.id === action.payload.id ? action.payload : quiz
        )
      };
    case 'ADD_SUBMISSION':
      return {
        ...state,
        submissions: [...state.submissions, action.payload]
      };
    default:
      return state;
  }
}

// Context
type QuizContextType = {
  state: AppState;
  addQuiz: (quiz: Quiz) => void;
  deleteQuiz: (id: string) => void;
  updateQuiz: (quiz: Quiz) => void;
  addSubmission: (submission: QuizSubmission) => void;
};

const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Provider
export function QuizProvider() {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  // Receives classroom context from QuizLayout
  const classroom  = useOutletContext();

  // Load from localStorage on init if available
  useEffect(() => {
    const savedState = localStorage.getItem('quizAppState');
    if (savedState) {
      const parsedState = JSON.parse(savedState) as AppState;

      // Initialize with saved state
      parsedState.quizzes.forEach(quiz => {
        dispatch({ type: 'ADD_QUIZ', payload: quiz });
      });

      parsedState.submissions.forEach(submission => {
        dispatch({ type: 'ADD_SUBMISSION', payload: submission });
      });
    }
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    localStorage.setItem('quizAppState', JSON.stringify(state));
  }, [state]);

  const addQuiz = (quiz: Quiz) => {
    dispatch({ type: 'ADD_QUIZ', payload: quiz });
  };

  const deleteQuiz = (id: string) => {
    dispatch({ type: 'DELETE_QUIZ', payload: id });
  };

  const updateQuiz = (quiz: Quiz) => {
    dispatch({ type: 'UPDATE_QUIZ', payload: quiz });
  };

  const addSubmission = (submission: QuizSubmission) => {
    dispatch({ type: 'ADD_SUBMISSION', payload: submission });
  };

  return (
    <QuizContext.Provider value={{
      state,
      addQuiz,
      deleteQuiz,
      updateQuiz,
      addSubmission
    }}>
      <Outlet context={classroom} />
    </QuizContext.Provider>
  );
}

// Hook
export function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}
