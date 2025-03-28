// external
import React from "react";
import { Link } from "react-router";

// css
import "./Button.css";

/**
 * Button Component
 *
 * A reusable button component that can render either a `<button>` element or a `<Link>` from `react-router`.
 *
 * @param {Object} props - Component props
 * @param {string} [props.design='default'] - The design style of the button (e.g., 'accent', 'raised', 'danger')
 * @param {string} [props.mode='primary'] - The color mode of the button (e.g., 'primary', 'flat', 'raised')
 * @param {Function} [props.onClick] - Callback function triggered when the button is clicked
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {boolean} [props.loading=false] - Whether the button is in a loading state
 * @param {string} [props.type='button'] - The type of the button (e.g., 'button', 'submit')
 * @param {string} [props.link] - If provided, the button will render as a `<Link>` with this `to` prop
 * @param {React.ReactNode} props.children - The content of the button
 * @returns {React.Element} - Rendered button or link
 */
const Button = ({
  design = "default",
  mode = "primary",
  onClick,
  disabled = false,
  loading = false,
  type = "button",
  link,
  children,
}) => {
  // Common class names for both button and link
  const className = `button button--${design} button--${mode}`;

  // Render as a Link if `link` prop is provided
  if (link) {
    return (
      <Link className={className} to={link}>
        {children}
      </Link>
    );
  }

  // Render as a button
  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;
