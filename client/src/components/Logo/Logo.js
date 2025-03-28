// external
import React from "react";

// css
import "./Logo.css";

/**
 * Logo Component
 *
 * A reusable logo component that displays the application's name or branding.
 *
 * @param {Object} [props] - Component props (currently unused, but can be extended in the future)
 * @returns {React.Element} - Rendered logo component
 */
const Logo = () => {
  return (
    <div className="logo">
      <img src="/images/logo.png" alt="Logo" width={36} height={36} />
      <div className="logo-text">
        <div>Feed</div>
        <div>Post</div>
      </div>
    </div>
  );
};

export default Logo;
