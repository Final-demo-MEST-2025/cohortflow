import React from 'react';

interface Option {
  id: string;
  label: string;
}

interface CheckboxGroupProps {
  label?: string;
  options: Option[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  error?: string;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  options,
  selectedValues,
  onChange,
  error
}) => {
  const handleChange = (optionId: string) => {
    const newValues = selectedValues.includes(optionId)
      ? selectedValues.filter(id => id !== optionId)
      : [...selectedValues, optionId];

    onChange(newValues);
  };

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
              type="checkbox"
              className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
              checked={selectedValues.includes(option.id)}
              onChange={() => handleChange(option.id)}
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

export default CheckboxGroup;
