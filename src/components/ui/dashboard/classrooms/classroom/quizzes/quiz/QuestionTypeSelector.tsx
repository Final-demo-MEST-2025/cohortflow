import React from 'react';
import Select from '../common/Select';
import { QuestionType } from '@/types';

interface QuestionTypeSelectorProps {
  value: QuestionType;
  onChange: (value: QuestionType) => void;
}

const questionTypeOptions = [
  { value: QuestionType.MultipleChoice, label: 'Multiple Choice (Single Answer)' },
  { value: QuestionType.MultipleSelection, label: 'Multiple Selection (Multiple Answers)' },
  { value: QuestionType.TrueFalse, label: 'True/False' },
  { value: QuestionType.ShortAnswer, label: 'Short Answer' },
  { value: QuestionType.FileUpload, label: 'File Upload' }
];

const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({ value, onChange }) => {
  const handleChange = (newValue: string) => {
    onChange(newValue as QuestionType);
  };

  return (
    <Select
      label="Question Type"
      options={questionTypeOptions}
      value={value}
      onChange={handleChange}
    />
  );
};

export default QuestionTypeSelector;
