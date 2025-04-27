import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardBody, CardFooter } from '../common/Card';
import Button from '../common/Button';
import { useQuiz } from '@/contexts/QuizContext';
import { QuizSubmission, Quiz, Question, QuestionType } from '@/types';

type AnswerValue = string | string[] | File | null;

const QuizResult: React.FC = () => {
  const { resultId } = useParams<{ resultId: string }>();
  const navigate = useNavigate();
  const { state } = useQuiz();

  const [submission, setSubmission] = useState<QuizSubmission | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    if (resultId) {
      const foundSubmission = state.submissions.find(s => s.id === resultId);
      if (foundSubmission) {
        setSubmission(foundSubmission);

        const relatedQuiz = state.quizzes.find(q => q.id === foundSubmission.quizId);
        if (relatedQuiz) {
          setQuiz(relatedQuiz);
        }
      }
    }
  }, [resultId, state.submissions, state.quizzes]);

  if (!submission || !quiz) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Result Not Found</h2>
        <p className="text-gray-600 mb-6">The quiz result you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/quizzes')}>Back to Quizzes</Button>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const getScoreColor = () => {
    if (!submission.score || !submission.maxScore) return 'text-gray-800';

    const percentage = (submission.score / submission.maxScore) * 100;

    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const renderQuestionResult = (question: Question) => {
    const answer = submission.answers.find(a => a.questionId === question.id);
    if (!answer) return null;

    const isCorrect = calculateIsCorrect(question, answer.value);

    return (
      <div key={question.id} className="mb-6 border-b border-gray-200 pb-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900">{question.title}</h3>
          {question.type !== QuestionType.ShortAnswer && question.type !== QuestionType.FileUpload && (
            <div className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
              {isCorrect ? `Correct (+${question.points})` : 'Incorrect (0)'}
            </div>
          )}
        </div>

        {renderAnswerDetail(question, answer.value)}
      </div>
    );
  };

  const calculateIsCorrect = (question: Question, value: AnswerValue): boolean => {
    if (question.type === QuestionType.ShortAnswer || question.type === QuestionType.FileUpload) {
      return true; // We don't score these automatically
    }

    if (question.type === QuestionType.MultipleChoice || question.type === QuestionType.TrueFalse) {
      const correctOption = question.options.find(opt => opt.isCorrect);
      return correctOption?.id === value;
    }

    if (question.type === QuestionType.MultipleSelection && Array.isArray(value)) {
      const correctOptionIds = question.options
        .filter(opt => opt.isCorrect)
        .map(opt => opt.id);

      return (
        value.length === correctOptionIds.length &&
        value.every(id => correctOptionIds.includes(id))
      );
    }

    return false;
  };

  const renderAnswerDetail = (question: Question, value: AnswerValue) => {
    switch (question.type) {
      case QuestionType.MultipleChoice:
      case QuestionType.TrueFalse:
        return (
          <div>
            <p className="text-sm text-gray-600 mb-3">Your answer:</p>
            <ul className="space-y-2">
              {question.options.map(option => {
                const isSelected = option.id === value;
                const isCorrect = option.isCorrect;

                let bgColorClass = '';
                if (isSelected && isCorrect) bgColorClass = 'bg-green-50';
                else if (isSelected && !isCorrect) bgColorClass = 'bg-red-50';
                else if (!isSelected && isCorrect) bgColorClass = 'bg-blue-50';

                return (
                  <li
                    key={option.id}
                    className={`p-3 rounded-md ${bgColorClass} flex items-center`}
                  >
                    <div className="mr-2">
                      {isSelected ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="flex-grow">{option.text}</span>
                    {isCorrect && (
                      <span className="text-green-600 text-sm font-medium">Correct answer</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );

      case QuestionType.MultipleSelection:
        return (
          <div>
            <p className="text-sm text-gray-600 mb-3">Your answers:</p>
            <ul className="space-y-2">
              {question.options.map(option => {
                const isSelected = Array.isArray(value) && value.includes(option.id);
                const isCorrect = option.isCorrect;

                let bgColorClass = '';
                if (isSelected && isCorrect) bgColorClass = 'bg-green-50';
                else if (isSelected && !isCorrect) bgColorClass = 'bg-red-50';
                else if (!isSelected && isCorrect) bgColorClass = 'bg-blue-50';

                return (
                  <li
                    key={option.id}
                    className={`p-3 rounded-md ${bgColorClass} flex items-center`}
                  >
                    <div className="mr-2">
                      {isSelected ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-brand-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="flex-grow">{option.text}</span>
                    {isCorrect && (
                      <span className="text-green-600 text-sm font-medium">Correct answer</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );

      case QuestionType.ShortAnswer:
        // return (
        //   <div>
        //     <p className="text-sm text-gray-600 mb-2">Your answer:</p>
        //     <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
        //       {value || <em className="text-gray-400">No answer provided</em>}
        //     </div>
        //   </div>
        // );

      case QuestionType.FileUpload:
        // return (
        //   <div>
        //     <p className="text-sm text-gray-600 mb-2">Your uploaded file:</p>
        //     <div className="p-3 bg-gray-50 rounded-md border border-gray-200 flex items-center">
        //       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
        //         <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
        //       </svg>
        //       {value || <em className="text-gray-400">No file uploaded</em>}
        //     </div>
        //   </div>
        // );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">Quiz Results</h2>
          <p className="text-gray-600 mt-1">{quiz.title}</p>
        </CardHeader>

        <CardBody>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="flex flex-wrap justify-between items-center">
              <div className="mb-2 md:mb-0">
                <p className="text-gray-500 text-sm">Submitted on:</p>
                <p className="font-medium">{formatDate(submission.submittedAt)}</p>
              </div>

              {submission.score !== undefined && submission.maxScore !== undefined && (
                <div className="text-center">
                  <p className="text-gray-500 text-sm">Your Score:</p>
                  <p className={`text-3xl font-bold ${getScoreColor()}`}>
                    {submission.score} / {submission.maxScore}
                    <span className="text-sm ml-2">
                      ({Math.round((submission.score / submission.maxScore) * 100)}%)
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Question Breakdown</h3>
            {quiz.questions.map(question => renderQuestionResult(question))}
          </div>
        </CardBody>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/quizzes')}
          >
            Back to Quizzes
          </Button>
          <Button
            onClick={() => navigate(`/quiz/${quiz.id}`)}
          >
            Take Quiz Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizResult;
