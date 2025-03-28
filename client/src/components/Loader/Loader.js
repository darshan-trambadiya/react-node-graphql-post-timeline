// external
import React from "react";

// css
import "./Loader.css";

/**
 * Loader Component
 *
 * A reusable loading spinner component to indicate loading states.
 *
 * @param {Object} [props] - Component props (currently unused, but can be extended in the future)
 * @returns {React.Element} - Rendered loader component
 */
const Loader = () => {
  return (
    <div className="loader" role="status" aria-label="Loading">
      <div aria-hidden="true" />
      <div aria-hidden="true" />
      <div aria-hidden="true" />
      <div aria-hidden="true" />
    </div>
  );
};

export default Loader;
