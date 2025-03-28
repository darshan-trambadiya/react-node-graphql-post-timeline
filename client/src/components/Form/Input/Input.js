// external
import React from "react";

// css
import "./Input.css";

/**
 * Input Component
 *
 * A reusable input component that can render either an `<input>` or `<textarea>` element.
 *
 * @param {Object} props - Component props
 * @param {string} [props.label] - The label for the input field
 * @param {string} props.id - The ID of the input field
 * @param {string} props.control - The type of control to render ('input' or 'textarea')
 * @param {string} [props.type] - The type of input (e.g., 'text', 'email', 'password')
 * @param {boolean} [props.required] - Whether the input is required
 * @param {string} [props.value] - The value of the input field
 * @param {string} [props.placeholder] - The placeholder text for the input field
 * @param {Function} props.onChange - Callback function triggered when the input value changes
 * @param {Function} [props.onBlur] - Callback function triggered when the input loses focus
 * @param {boolean} [props.valid] - Whether the input value is valid
 * @param {boolean} [props.touched] - Whether the input has been touched
 * @param {number} [props.rows] - The number of rows for a textarea (if control is 'textarea')
 * @returns {React.Element} - Rendered input or textarea element
 */
const Input = ({
  label,
  id,
  control = "input",
  type = "text",
  required = false,
  value = "",
  placeholder = "",
  onChange,
  onBlur,
  valid = true,
  touched = false,
  rows = 3,
}) => {
  // Determine the class names based on validity and touch state
  const inputClasses = [
    !valid && touched ? "invalid" : "valid",
    touched ? "touched" : "untouched",
  ].join(" ");

  return (
    <div className="input">
      {label && <label htmlFor={id}>{label}</label>}
      {control === "input" && (
        <input
          className={inputClasses}
          type={type}
          id={id}
          name={id}
          required={required}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
      {control === "textarea" && (
        <textarea
          className={inputClasses}
          id={id}
          name={id}
          rows={rows}
          required={required}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      )}
    </div>
  );
};

export default Input;
