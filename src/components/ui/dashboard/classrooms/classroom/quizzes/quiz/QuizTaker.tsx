import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardBody, CardFooter } from '../common/Card';
import Button from '../common/Button';
import RadioGroup from '../common/RadioGroup';
import CheckboxGroup from '../common/CheckboxGroup';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import { useQuiz } from '@/contexts/QuizContext';
import { QuestionType, Quiz, Answer, QuizSubmission } from '@/types';
import { generateId, getCurrentDate } from '@/utils';

const QuizTaker: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { state, addSubmission } = useQuiz();

  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (quizId) {
      const quiz = state.quizzes.find(q => q.id === quizId);
      if (quiz) {
        setCurrentQuiz(quiz);
        // Initialize answers array
        const initialAnswers = quiz.questions.map(question => ({
          questionId: question.id,
          value: question.type === QuestionType.MultipleSelection ? [] : null
        }));
        setAnswers(initialAnswers);
      }
    }
  }, [quizId, state.quizzes]);

  if (!currentQuiz) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h2>
        <p className="text-gray-600 mb-6">The quiz you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => navigate('/quizzes')}>Back to Quizzes</Button>
      </div>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];

  const handleSingleChoiceChange = (value: string) => {
    const newAnswers = [...answers];
    const answer = newAnswers.find(a => a.questionId === currentQuestion.id);
    if (answer) {
      answer.value = value;
    }
    setAnswers(newAnswers);
    setValidationErrors(prev => ({ ...prev, [currentQuestion.id]: '' }));
  };

  const handleMultipleChoiceChange = (values: string[]) => {
    const newAnswers = [...answers];
    const answer = newAnswers.find(a => a.questionId === currentQuestion.id);
    if (answer) {
      answer.value = values;
    }
    setAnswers(newAnswers);
    setValidationErrors(prev => ({ ...prev, [currentQuestion.id]: '' }));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newAnswers = [...answers];
    const answer = newAnswers.find(a => a.questionId === currentQuestion.id);
    if (answer) {
      answer.value = e.target.value;
    }
    setAnswers(newAnswers);
    setValidationErrors(prev => ({ ...prev, [currentQuestion.id]: '' }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newAnswers = [...answers];
      const answer = newAnswers.find(a => a.questionId === currentQuestion.id);
      if (answer) {
        answer.value = file;
      }
      setAnswers(newAnswers);
      setValidationErrors(prev => ({ ...prev, [currentQuestion.id]: '' }));
    }
  };

  const validateCurrentAnswer = (): boolean => {
    if (!currentQuestion.required) return true;

    const answer = answers.find(a => a.questionId === currentQuestion.id);
    if (!answer) return false;

    let isValid = false;

    switch (currentQuestion.type) {
      case QuestionType.MultipleChoice:
      case QuestionType.TrueFalse:
        isValid = !!answer.value;
        break;
      case QuestionType.MultipleSelection:
        isValid = Array.isArray(answer.value) && answer.value.length > 0;
        break;
      case QuestionType.ShortAnswer:
        isValid = typeof answer.value === 'string' && answer.value.trim() !== '';
        break;
      case QuestionType.FileUpload:
        isValid = !!answer.value && answer.value instanceof File;
        break;
      default:
        isValid = false;
    }

    if (!isValid) {
      setValidationErrors(prev => ({
        ...prev,
        [currentQuestion.id]: 'This question requires an answer'
      }));
    }

    return isValid;
  };

  const goToNextQuestion = () => {
    if (validateCurrentAnswer()) {
      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentAnswer()) return;

    // Validate all required questions
    const errors: Record<string, string> = {};
    let hasErrors = false;

    currentQuiz.questions.forEach(question => {
      if (question.required) {
        const answer = answers.find(a => a.questionId === question.id);
        if (!answer || !answer.value) {
          errors[question.id] = 'This question requires an answer';
          hasErrors = true;
        } else if (
          question.type === QuestionType.MultipleSelection &&
          Array.isArray(answer.value) &&
          answer.value.length === 0
        ) {
          errors[question.id] = 'This question requires an answer';
          hasErrors = true;
        } else if (
          question.type === QuestionType.ShortAnswer &&
          typeof answer.value === 'string' &&
          answer.value.trim() === ''
        ) {
          errors[question.id] = 'This question requires an answer';
          hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    // Simplify file uploads for local storage (in a real app, you'd upload these files)
    const processedAnswers = answers.map(answer => {
      if (answer.value instanceof File) {
        return { ...answer, value: (answer.value as File).name };
      }
      return answer;
    });

    // Calculate score (auto-grading)
    let score = 0;
    let maxScore = 0;

    currentQuiz.questions.forEach(question => {
      maxScore += question.points;
      const answer = answers.find(a => a.questionId === question.id);

      // Skip scoring for file uploads
      if (question.type === QuestionType.FileUpload || !answer) return;

      // For short answers, just award points if they answered
      if (question.type === QuestionType.ShortAnswer) {
        if (answer.value && typeof answer.value === 'string' && answer.value.trim() !== '') {
          score += question.points;
        }
        return;
      }

      // For true/false and multiple choice
      if (question.type === QuestionType.TrueFalse || question.type === QuestionType.MultipleChoice) {
        const correctOption = question.options.find(opt => opt.isCorrect);
        if (correctOption && answer.value === correctOption.id) {
          score += question.points;
        }
        return;
      }

      // For multiple selection
      if (question.type === QuestionType.MultipleSelection && Array.isArray(answer.value)) {
        const correctOptionIds = question.options
          .filter(opt => opt.isCorrect)
          .map(opt => opt.id);

        // Check if all selected options are correct and all correct options are selected
        const isAllCorrect =
          answer.value.length === correctOptionIds.length &&
          answer.value.every(id => correctOptionIds.includes(id));

        if (isAllCorrect) {
          score += question.points;
        }
      }
    });

    const submission: QuizSubmission = {
      id: generateId(),
      quizId: currentQuiz.id,
      submittedAt: getCurrentDate(),
      answers: processedAnswers,
      score,
      maxScore
    };

    addSubmission(submission);
    navigate(`/result/${submission.id}`);
  };

  const renderQuestionInput = () => {
    const answer = answers.find(a => a.questionId === currentQuestion.id);
    const error = validationErrors[currentQuestion.id];

    switch (currentQuestion.type) {
      case QuestionType.MultipleChoice:
      case QuestionType.TrueFalse:
        return (
          <RadioGroup
            name={`question-${currentQuestion.id}`}
            options={currentQuestion.options.map(opt => ({ id: opt.id, label: opt.text }))}
            selectedValue={answer?.value as string}
            onChange={handleSingleChoiceChange}
            error={error}
          />
        );

      case QuestionType.MultipleSelection:
        return (
          <CheckboxGroup
            options={currentQuestion.options.map(opt => ({ id: opt.id, label: opt.text }))}
            selectedValues={answer?.value as string[] || []}
            onChange={handleMultipleChoiceChange}
            error={error}
          />
        );

      case QuestionType.ShortAnswer:
        return (
          <TextArea
            placeholder="Your answer"
            value={answer?.value as string || ''}
            onChange={handleTextChange}
            rows={4}
            error={error}
          />
        );

      case QuestionType.FileUpload:
        return (
          <div>
            <Input
              type="file"
              onChange={handleFileChange}
              error={error}
            />
            {answer?.value instanceof File && (
              <p className="mt-2 text-sm text-green-600">
                File selected: {(answer.value as File).name}
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">{currentQuiz.title}</h2>
          {currentQuiz.description && (
            <p className="text-gray-600 mt-2">{currentQuiz.description}</p>
          )}
        </CardHeader>

        <CardBody>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
            </p>
            <p className="text-sm text-gray-500">
              {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {currentQuestion.title}
              {currentQuestion.required && (
                <span className="text-red-500 ml-1">*</span>
              )}
            </h3>

            {renderQuestionInput()}
          </div>
        </CardBody>

        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>

          {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
            <Button onClick={goToNextQuestion}>
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizTaker;
