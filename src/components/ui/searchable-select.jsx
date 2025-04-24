import React, { useMemo } from "react";
import Select from "react-select";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

const SearchableSelect = ({
  options = [],
  value,
  onChange,
  isMulti = false,
  placeholder = "Select...",
  closeMenuOnSelect = false,
  valueKey='value',
  labelKey='label',
  name,
  className = "",
  ...props
}) => {

  // Memoize options in react-select format
  const formattedOptions = useMemo(() => {
    return options.map((opt) => ({
      value: opt[valueKey],
      label: opt[labelKey]
    }));
  }, [options, valueKey, labelKey]);

  // Transform initial value to react-select format
  const formattedValue = useMemo(() => {
    if (!value) return isMulti ? [] : null;

    // For multi-select, value is an array of ids (or full objects in edit mode)
    if (isMulti && Array.isArray(value)) {
      return value.map((val) => 
        typeof val === 'object'
          ? { value: val[valueKey], label: val[labelKey] }
          : formattedOptions.find((opt) => opt.value === val)
      );
    }

    // Single select
    return typeof value === "object"
      ? { value: value[valueKey], label: value[labelKey] }
      : formattedOptions.find((opt) => opt.value === value) || null;
  }, [value, isMulti, formattedOptions, valueKey, labelKey]);

  // Handle change and return IDs only
  const handleChange = selected => {
    if (isMulti) {
      onChange(selected ? selected.map((opt) => opt.value) : []);
    } else {
      onChange(selected ? selected.value : null);
    }
  }

  return (
    <div className={className}>
      {/* <div className="pointer-events-none absolute left-3 top-2.5 z-10">
        <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
      </div> */}
      <Select
        {...props}
        name={name}
        options={formattedOptions}
        value={formattedValue}
        onChange={handleChange}
        isMulti={isMulti}
        isSearchable
        components={animatedComponents}
        placeholder={placeholder}
        className="w-full"
        classNamePrefix="react-select"
        closeMenuOnSelect={closeMenuOnSelect}
        styles={{}}
      />
    </div>
  );
};

export default SearchableSelect;
