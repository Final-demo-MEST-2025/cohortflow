import React, { useMemo, useEffect, useRef } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const SearchableSelect = ({
  options = [],
  value,
  onChange,
  isMulti = false,
  placeholder = "Select...",
  closeMenuOnSelect = false,
  valueKey = "value",
  labelKey = "label",
  name,
  className = "",
  initialData,
  customStyles = {},
  ...props
}) => {
  const didInit = useRef(false);

  // Format options
  const formattedOptions = useMemo(() => {
    return options.map((opt) => ({
      value: opt[valueKey],
      label: opt[labelKey],
    }));
  }, [options, valueKey, labelKey]);

  // Format selected value(s)
  const formattedValue = useMemo(() => {
    if (!value) return isMulti ? [] : null;

    if (isMulti && Array.isArray(value)) {
      return value.map((val) =>
        typeof val === "object"
          ? { value: val[valueKey], label: val[labelKey] }
          : formattedOptions.find((opt) => opt.value === val)
      );
    }

    return typeof value === "object"
      ? { value: value[valueKey], label: value[labelKey] }
      : formattedOptions.find((opt) => opt.value === value) || null;
  }, [value, isMulti, formattedOptions, valueKey, labelKey]);

  // Normalize and push initial data into parent state
  useEffect(() => {
    if (didInit.current || !initialData) return;

    if (isMulti && Array.isArray(initialData)) {
      const formatted = initialData.map((item) => ({
        value: item[valueKey],
        label: item[labelKey],
      }));
      onChange(formatted.map((f) => f.value));
    } else if (typeof initialData === "object" && initialData !== null) {
      onChange(initialData[valueKey]);
    }

    didInit.current = true;
  }, [initialData, isMulti, onChange, labelKey, valueKey]);

  // Handle user change
  const handleChange = (selected) => {
    if (isMulti) {
      onChange(selected ? selected.map((opt) => opt.value) : []);
    } else {
      onChange(selected ? selected.value : null);
    }
  };

  return (
    <div className={className}>
      <Select
        {...props}
        name={name}
        options={formattedOptions}
        value={formattedValue}
        onChange={handleChange}
        isMulti={isMulti}
        isSearchable
        placeholder={placeholder}
        components={animatedComponents}
        closeMenuOnSelect={closeMenuOnSelect}
        classNamePrefix="react-select"
        className="w-full"
        styles={customStyles}
      />
    </div>
  );
};

export default SearchableSelect;
