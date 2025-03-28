// external
import React from "react";

// css
import "./Paginator.css";

/**
 * Paginator Component
 *
 * A reusable pagination component that allows navigation between pages.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to display within the paginator
 * @param {number} props.currentPage - The current page number
 * @param {number} props.lastPage - The last page number
 * @param {Function} props.onPrevious - Callback function triggered when the "Previous" button is clicked
 * @param {Function} props.onNext - Callback function triggered when the "Next" button is clicked
 * @returns {React.Element} - Rendered paginator component
 */
const Paginator = ({ children, currentPage, lastPage, onPrevious, onNext }) => {
  return (
    <div className="paginator" role="navigation" aria-label="Pagination">
      {children}
      <div className="paginator__controls">
        {currentPage > 1 && (
          <button
            className="paginator__control"
            onClick={onPrevious}
            aria-label="Previous Page"
          >
            Previous
          </button>
        )}
        {currentPage < lastPage && (
          <button
            className="paginator__control"
            onClick={onNext}
            aria-label="Next Page"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Paginator;
