// external
import React from "react";

// css
import "./Input.css";

/**
 * FilePicker Component
 *
 * A reusable file input component that allows users to select files.
 *
 * @param {Object} props - Component props
 * @param {string} props.label - The label for the file input field
 * @param {string} props.id - The ID of the file input field
 * @param {Function} props.onChange - Callback function triggered when a file is selected
 * @param {Function} [props.onBlur] - Callback function triggered when the input loses focus
 * @param {boolean} [props.valid=true] - Whether the file input value is valid
 * @param {boolean} [props.touched=false] - Whether the file input has been touched
 * @returns {React.Element} - Rendered file input element
 */
const FilePicker = ({
  label,
  id,
  onChange,
  onBlur,
  valid = true,
  touched = false,
}) => {
  // Determine the class names based on validity and touch state
  const inputClasses = [
    !valid && touched ? "invalid" : "valid",
    touched ? "touched" : "untouched",
  ].join(" ");

  return (
    <div className="input">
      <label htmlFor={id}>{label}</label>
      <input
        className={inputClasses}
        type="file"
        id={id}
        name={id}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};

export default FilePicker;
