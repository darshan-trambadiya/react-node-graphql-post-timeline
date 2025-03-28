// external
import React from "react";

// components
import Backdrop from "../Backdrop/Backdrop";
import Modal from "../Modal/Modal";

/**
 * ErrorHandler Component
 *
 * A reusable error handler component that displays a modal with an error message
 * and a backdrop when an error occurs.
 *
 * @param {Object} props - Component props
 * @param {Error} [props.error] - The error object to display
 * @param {Function} [props.onHandle] - Callback function triggered when the error is dismissed
 * @returns {React.Element} - Rendered error handler with backdrop and modal
 */
const ErrorHandler = ({ error, onHandle = () => {} }) => {
  // Only render if there's an error
  if (!error) return null;

  return (
    <>
      <Backdrop onClick={onHandle} open={!!error} />
      <Modal
        title="An Error Occurred"
        onCancelModal={onHandle}
        onAcceptModal={onHandle}
        acceptEnabled
      >
        <p>{error.message}</p>
      </Modal>
    </>
  );
};

export default ErrorHandler;
