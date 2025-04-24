import React from "react";
import Select from "react-select";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import makeAnimated from 'react-select/animated';


// For multi=select animation
const animatedComponents = makeAnimated();

// Custom search icon inside the select input
// const SearchIndicator = (props) => (
//   <components.DropdownIndicator {...props}>
//     <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
//   </components.DropdownIndicator>
// );

// Tailwind-friendly custom styles
const styles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "transparent",
    borderColor: state.isFocused ? "purple" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 1px #2563eb" : "none",
    "&:hover": {
      borderColor: "none",
    },
    padding: "2px 2px",
    borderRadius: "0.5rem", // rounded-lg
    minHeight: "2.5rem", // h-10
    fontSize: "0.875rem", // text-sm
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "red"
      : state.isFocused
      ? "#eff6ff"
      : "white",
    color: state.isSelected ? "white" : "#111827",
    cursor: "pointer",
    fontSize: "0.875rem",
    padding: "0.5rem 0.75rem",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#e0f2fe",
    borderRadius: "0.375rem",
    padding: "0 0.25rem",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#2563eb",
    fontSize: "0.75rem",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#2563eb",
    ":hover": {
      backgroundColor: "#bfdbfe",
      color: "#1e40af",
    },
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af",
    fontSize: "0.875rem",
  }),
  input: (base) => ({
    ...base,
    color: "#111827",
  }),
  menu: (base) => ({
    ...base,
    zIndex: 100,
  }),
};

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isMulti = false,
  isDisabled = false,
  name,
  className = "",
  closeMenuOnSelect = false,
  customStyles=styles
}) => {
  return (
    <div className={className}>
      <Select
        name={name}
        isSearchable
        isMulti={isMulti}
        isDisabled={isDisabled}
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        styles={customStyles}
        components={animatedComponents}
        classNamePrefix="react-select"
        closeMenuOnSelect={closeMenuOnSelect}
      />
    </div>
  );
};

export default SearchableSelect;
