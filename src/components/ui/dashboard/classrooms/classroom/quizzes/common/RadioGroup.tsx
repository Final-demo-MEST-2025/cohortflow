import React from 'react';

interface Option {
  id: string;
  label: string;
}

interface RadioGroupProps {
  label?: string;
  name: string;
  options: Option[];
  selectedValue?: string;
  onChange: (value: string) => void;
  error?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  options,
  selectedValue,
  onChange,
  error
}) => {
  return (
    <div className="w-full">
      {label && (
        <p className="block mb-2 font-medium text-gray-700">{label}</p>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center">
            <input
              id={option.id}
              type="radio"
              name={name}
              className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300"
              checked={selectedValue === option.id}
              onChange={() => onChange(option.id)}
            />
            <label
              htmlFor={option.id}
              className="ml-2 block text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default RadioGroup;
