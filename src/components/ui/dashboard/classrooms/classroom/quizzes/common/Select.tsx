import React, { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
  label?: string;
  options: Option[];
  error?: string;
  onChange: (value: string) => void;
};

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  id,
  value,
  onChange,
  ...props
}) => {
  const selectId = id || Math.random().toString(36).substring(2, 9);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          // className="block mb-1 font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-brand-500 focus:ring-2 transition-all ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${className}`}
        value={value}
        onChange={handleChange}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
