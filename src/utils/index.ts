// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};

// Get current date in ISO format
export const getCurrentDate = (): string => {
  return new Date().toISOString();
};

// Calculate quiz score based on answers
export const calculateScore = (
  answers: { questionId: string; value: string | string[] | File | null }[],
  questions: {
    id: string;
    type: string;
    options: { id: string; text: string; isCorrect?: boolean }[];
    points: number;
  }[]
): { score: number; maxScore: number } => {
  let score = 0;
  let maxScore = 0;

  questions.forEach(question => {
    maxScore += question.points;

    // Find the corresponding answer
    const answer = answers.find(a => a.questionId === question.id);
    if (!answer) return;

    // Skip scoring for file uploads
    if (question.type === 'file_upload') return;

    // For short answers, if there's any value, we'll consider it correct
    // In a real app, you'd want to implement more sophisticated validation
    if (question.type === 'short_answer') {
      if (answer.value && typeof answer.value === 'string' && answer.value.trim() !== '') {
        score += question.points;
      }
      return;
    }

    // For true/false and multiple choice
    if (question.type === 'true_false' || question.type === 'multiple_choice') {
      const correctOption = question.options.find(opt => opt.isCorrect);
      if (correctOption && answer.value === correctOption.id) {
        score += question.points;
      }
      return;
    }

    // For multiple selection
    if (question.type === 'multiple_selection' && Array.isArray(answer.value)) {
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

  return { score, maxScore };
};
