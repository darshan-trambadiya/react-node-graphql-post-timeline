// external
import React from "react";

// css
import "./Toolbar.css";

/**
 * Toolbar Component
 *
 * A reusable toolbar component that wraps its children in a styled container.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to display within the toolbar
 * @returns {React.Element} - Rendered toolbar component
 */
const Toolbar = ({ children }) => {
  return (
    <div className="toolbar" role="toolbar" aria-label="Toolbar">
      {children}
    </div>
  );
};

export default Toolbar;
