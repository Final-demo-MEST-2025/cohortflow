import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardHeader, CardBody, CardFooter } from '../common/Card';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import QuestionEditor from '../quiz/QuestionEditor';
import { Quiz, Question, QuestionType } from '@/types';
import { useQuiz } from '@/contexts/QuizContext';
import { generateId, getCurrentDate } from '@/utils';

const QuizCreator: React.FC = () => {
  const navigate = useNavigate();
  const { addQuiz } = useQuiz();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [titleError, setTitleError] = useState('');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (e.target.value.trim()) {
      setTitleError('');
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: generateId(),
      title: '',
      type: QuestionType.MultipleChoice,
      options: [],
      required: false,
      points: 1
    };

    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (updatedQuestion: Question) => {
    const newQuestions = questions.map(q =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setQuestions(newQuestions);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!title.trim()) {
      setTitleError('Quiz title is required');
      return;
    }

    const newQuiz: Quiz = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      createdAt: getCurrentDate(),
      questions
    };

    addQuiz(newQuiz);
    navigate('/quizzes');
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-gray-900">Create New Quiz</h2>
          <p className="text-gray-600 mt-1">
            Fill out the form below to create a new quiz
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardBody>
            <div className="space-y-6">
              <Input
                label="Quiz Title"
                placeholder="Enter quiz title"
                value={title}
                onChange={handleTitleChange}
                error={titleError}
                required
              />

              <TextArea
                label="Description (optional)"
                placeholder="Enter quiz description"
                value={description}
                onChange={handleDescriptionChange}
                rows={3}
              />

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Questions</h3>

                {questions.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <p className="text-gray-500 mb-4">No questions added yet</p>
                    <Button
                      type="button"
                      onClick={addQuestion}
                    >
                      Add Your First Question
                    </Button>
                  </div>
                ) : (
                  <div>
                    {questions.map(question => (
                      <QuestionEditor
                        key={question.id}
                        question={question}
                        onUpdate={updateQuestion}
                        onRemove={removeQuestion}
                      />
                    ))}

                    <Button
                      type="button"
                      variant="secondary"
                      onClick={addQuestion}
                      className="mt-4"
                    >
                      Add Another Question
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardBody>

          <CardFooter className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/quizzes')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={questions.length === 0}
              aria-disabled={questions.length === 0}
            >
              Create Quiz
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default QuizCreator;
