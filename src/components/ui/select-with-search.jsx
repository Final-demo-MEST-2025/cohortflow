import React, { useEffect, useMemo } from "react";
import Select from "react-select";
import { deepMerge } from "../../utils/deepMerge";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";



const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "transparent",
      borderColor: state.isFocused ? "#3b82f6" : "#e5e7eb",
      boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : "none",
      "&:hover": {
        borderColor: "#3b82f6",
      },
      padding: "2px",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#3b82f6"
        : state.isFocused
        ? "#eff6ff"
        : "#fff",
      color: "#111827",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#dbeafe",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#9ca3af",
    }),
  };



const SearchableSelect = ({
  name,
  label,
  options,
  isMulti = false,
  value,
  onChange,
  extractId = (item) => item.id,
  extractLabel = (item) => item.name,
  className = "",
  placeholder = "Select...",
  initialData,
  icon=false,
  valueKey='id',
  labelKey='name'
}) => {
  // Memoize options in react-select format
  const formattedOptions = useMemo(() => {
    return options.map((opt) => ({
      value: opt[valueKey],
      label: opt[labelKey],
    }));
  }, [options, valueKey, labelKey]);

  // Transform initialData for react-select
  useEffect(() => {
    if (!initialData) return;
    if (initialData && Array.isArray(initialData)) {
      const transformedValue = isMulti
        ? initialData.map((item) => ({
            label: extractLabel(item),
            value: extractId(item),
          }))
        : {
            label: extractLabel(initialData),
            value: extractId(initialData),
          };

      const selectedValue = isMulti
        ? transformedValue.map((opt) => opt.value)
        : transformedValue.value;

      onChange((prev) => deepMerge({ ...prev }, { [name]: selectedValue }));
    }
  }, [isMulti, extractId, onChange, extractLabel, name, initialData]);

  const handleChange = (selected) => {
    if (isMulti) {
      const ids = selected ? selected.map((opt) => opt.value) : [];
      onChange((prev) => deepMerge({ ...prev }, { [name]: ids }));
    } else {
      const id = selected ? selected.value : null;
      onChange((prev) => deepMerge({ ...prev }, { [name]: id }));
    }
  };

  const currentValue = () => {
    if (!value) return null;

    if (isMulti) {
      return options
        .filter((opt) => value.includes(opt.value))
        .map((opt) => ({ label: opt.label, value: opt.value }));
    } else {
      return options.find((opt) => opt.value === value) || null;
    }
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <MagnifyingGlassIcon className="w-4 h-4 absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 pointer-events-none" />
        )}
        <Select
          isMulti={isMulti}
          options={formattedOptions}
          value={currentValue()}
          onChange={handleChange}
          styles={customStyles}
          placeholder={placeholder}
          className="pl-8"
        />
      </div>
    </div>
  );
};

export default SearchableSelect;
