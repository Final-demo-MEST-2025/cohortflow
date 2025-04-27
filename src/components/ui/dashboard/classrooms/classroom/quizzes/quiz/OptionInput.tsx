import React, { useState } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';
import { Option } from '@/types';

interface OptionInputProps {
  option: Option;
  showCorrectOption: boolean;
  onUpdate: (updatedOption: Option) => void;
  onRemove: (id: string) => void;
}

const OptionInput: React.FC<OptionInputProps> = ({
  option,
  showCorrectOption,
  onUpdate,
  onRemove
}) => {
  const [text, setText] = useState(option.text);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    onUpdate({ ...option, text: newText });
  };

  const handleCorrectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...option, isCorrect: e.target.checked });
  };

  return (
    <div className="flex items-center gap-2 mb-2">
      <div className="flex-grow">
        <Input
          placeholder="Option text"
          value={text}
          onChange={handleTextChange}
        />
      </div>

      {showCorrectOption && (
        <div className="flex items-center whitespace-nowrap">
          <input
            type="checkbox"
            id={`correct-${option.id}`}
            checked={option.isCorrect || false}
            onChange={handleCorrectChange}
            className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
          />
          <label 
            htmlFor={`correct-${option.id}`} 
            className="ml-2 text-sm text-gray-700"
          >
            Correct
          </label>
        </div>
      )}

      <Button
        type="button"
        variant="danger"
        size="sm"
        onClick={() => onRemove(option.id)}
        aria-label="Remove option"
      >
        ×
      </Button>
    </div>
  );
};

export default OptionInput;
