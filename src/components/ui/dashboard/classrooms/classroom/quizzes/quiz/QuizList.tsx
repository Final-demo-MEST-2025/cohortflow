import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card, { CardBody } from '../common/Card';
import Button from '../common/Button';
import { useQuiz } from '@/contexts/QuizContext';

const QuizList: React.FC = () => {
  const navigate = useNavigate();
  const { state, deleteQuiz } = useQuiz();

  const handleCreateQuiz = () => {
    navigate('/create');
  };

  const handleTakeQuiz = (id: string) => {
    navigate(`/quiz/${id}`);
  };

  const handleDeleteQuiz = (id: string) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      deleteQuiz(id);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
        <Button onClick={handleCreateQuiz}>Create New Quiz</Button>
      </div>

      {state.quizzes.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No quizzes yet</h3>
          <p className="text-gray-500 mb-6">
            Get started by creating your first quiz
          </p>
          <Button onClick={handleCreateQuiz}>Create Quiz</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.quizzes.map(quiz => (
            <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
              <CardBody>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
                  {quiz.title}
                </h3>

                <p className="text-gray-500 text-sm mb-3">
                  Created on {formatDate(quiz.createdAt)}
                </p>

                <p className="text-gray-700 mb-3 line-clamp-2 h-12">
                  {quiz.description || 'No description provided'}
                </p>

                <p className="text-gray-500 text-sm mb-4">
                  {quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'}
                </p>

                <div className="flex space-x-3">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleTakeQuiz(quiz.id)}
                    className="flex-1"
                  >
                    Take Quiz
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteQuiz(quiz.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
