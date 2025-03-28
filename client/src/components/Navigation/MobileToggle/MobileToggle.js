// external
import React from "react";

// css
import "./MobileToggle.css";

/**
 * MobileToggle Component
 *
 * A reusable button component that toggles mobile navigation visibility.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onOpen - Callback function triggered when the button is clicked
 * @returns {React.Element} - Rendered mobile toggle button
 */
const MobileToggle = ({ onOpen }) => {
  return (
    <button
      className="mobile-toggle"
      onClick={onOpen}
      aria-label="Toggle mobile navigation"
    >
      <span className="mobile-toggle__bar" aria-hidden="true" />
      <span className="mobile-toggle__bar" aria-hidden="true" />
      <span className="mobile-toggle__bar" aria-hidden="true" />
    </button>
  );
};

export default MobileToggle;
