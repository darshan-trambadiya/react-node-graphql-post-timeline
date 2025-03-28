// external
import React from "react";
import ReactDOM from "react-dom";

// css
import "./Backdrop.css";

/**
 * Backdrop Component
 *
 * A reusable backdrop component that can be used to overlay the screen.
 * It is rendered outside the DOM hierarchy using React portals.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.open - Controls whether the backdrop is visible
 * @param {Function} props.onClick - Callback function triggered when the backdrop is clicked
 * @returns {React.Portal} - Rendered backdrop using React portals
 */
const Backdrop = ({ open = false, onClick = () => {} }) => {
  // Use React portals to render the backdrop outside the DOM hierarchy
  return ReactDOM.createPortal(
    <div
      className={`backdrop ${open ? "open" : ""}`} // Dynamically add 'open' class
      onClick={onClick} // Handle backdrop click
      role="presentation" // Accessibility: indicate this is a presentational element
      aria-hidden={!open} // Hide from screen readers when not open
    />,
    document.getElementById("backdrop-root") // Render in the backdrop-root element
  );
};

export default Backdrop;
