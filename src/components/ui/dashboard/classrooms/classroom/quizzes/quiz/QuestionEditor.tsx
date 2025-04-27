import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { Question, QuestionType, Option } from '@/types';
import OptionInput from './OptionInput';
import QuestionTypeSelector from './QuestionTypeSelector';
import { generateId } from '@/utils';

interface QuestionEditorProps {
  question: Question;
  onUpdate: (updatedQuestion: Question) => void;
  onRemove: (id: string) => void;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onUpdate,
  onRemove
}) => {
  const [title, setTitle] = useState(question.title);
  const [type, setType] = useState(question.type);
  const [required, setRequired] = useState(question.required);
  const [points, setPoints] = useState(question.points);
  const [options, setOptions] = useState<Option[]>(question.options);

  // Initialize options for true/false questions if none exist
  useEffect(() => {
    if (type === QuestionType.TrueFalse && options.length === 0) {
      const defaultOptions: Option[] = [
        { id: generateId(), text: 'True', isCorrect: false },
        { id: generateId(), text: 'False', isCorrect: false }
      ];
      setOptions(defaultOptions);
    }
  }, [type, options.length]);

  useEffect(() => {
    const updatedQuestion = {
      ...question,
      title,
      type,
      required,
      points,
      options
    };
    onUpdate(updatedQuestion);
  }, [title, type, required, points, options]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPoints(isNaN(value) ? 0 : value);
  };

  const handleTypeChange = (newType: QuestionType) => {
    setType(newType);

    // Reset options when question type changes (except for true/false)
    if (newType !== QuestionType.TrueFalse) {
      setOptions([]);
    }
  };

  const handleRequiredChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequired(e.target.checked);
  };

  const addOption = () => {
    const newOption: Option = {
      id: generateId(),
      text: '',
      isCorrect: false
    };
    setOptions([...options, newOption]);
  };

  const updateOption = (updatedOption: Option) => {
    const newOptions = options.map(option =>
      option.id === updatedOption.id ? updatedOption : option
    );

    // For single-choice questions, ensure only one option is marked as correct
    if (type === QuestionType.MultipleChoice && updatedOption.isCorrect) {
      newOptions.forEach(opt => {
        if (opt.id !== updatedOption.id) {
          opt.isCorrect = false;
        }
      });
    }

    setOptions(newOptions);
  };

  const removeOption = (id: string) => {
    setOptions(options.filter(option => option.id !== id));
  };

  const showOptionInput = (
    type === QuestionType.MultipleChoice ||
    type === QuestionType.MultipleSelection ||
    type === QuestionType.TrueFalse
  );

  const showCorrectOption = (
    type === QuestionType.MultipleChoice ||
    type === QuestionType.MultipleSelection
  );

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Question</h3>
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() => onRemove(question.id)}
          aria-label="Remove question"
        >
          Remove
        </Button>
      </div>

      <div className="space-y-4">
        <Input
          label="Question Title"
          placeholder="Enter your question here"
          value={title}
          onChange={handleTitleChange}
        />

        <div className="flex gap-4">
          <div className="flex-grow">
            <QuestionTypeSelector value={type} onChange={handleTypeChange} />
          </div>

          <div className="w-32">
            <Input
              label="Points"
              type="number"
              min="0"
              max="100"
              value={points.toString()}
              onChange={handlePointsChange}
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id={`required-${question.id}`}
            type="checkbox"
            checked={required}
            onChange={handleRequiredChange}
            className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
          />
          <label htmlFor={`required-${question.id}`} className="ml-2 text-sm text-gray-700">
            Required question
          </label>
        </div>

        {showOptionInput && (
          <div>
            <p className="mb-2 font-medium text-gray-700">Options</p>
            <div className="mb-2">
              {options.map(option => (
                <OptionInput
                  key={option.id}
                  option={option}
                  showCorrectOption={showCorrectOption}
                  onUpdate={updateOption}
                  onRemove={removeOption}
                />
              ))}
            </div>

            {type !== QuestionType.TrueFalse && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addOption}
              >
                Add Option
              </Button>
            )}
          </div>
        )}

        {type === QuestionType.ShortAnswer && (
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <p className="text-gray-500 italic">
              This question will require a text answer from the respondent.
            </p>
          </div>
        )}

        {type === QuestionType.FileUpload && (
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <p className="text-gray-500 italic">
              This question will allow the respondent to upload a file.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionEditor;
