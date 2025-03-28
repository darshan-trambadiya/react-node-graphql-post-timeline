// external
import React from "react";
import ReactDOM from "react-dom";

// components
import Button from "../Button/Button";

// css
import "./Modal.css";

/**
 * Modal Component
 *
 * A reusable modal component that displays a dialog with a title, content, and actions.
 * It is rendered outside the DOM hierarchy using React portals.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - The title of the modal
 * @param {React.ReactNode} props.children - The content of the modal
 * @param {Function} props.onCancelModal - Callback function triggered when the "Cancel" button is clicked
 * @param {Function} props.onAcceptModal - Callback function triggered when the "Accept" button is clicked
 * @param {boolean} [props.acceptEnabled=true] - Whether the "Accept" button is enabled
 * @param {boolean} [props.isLoading=false] - Whether the "Accept" button is in a loading state
 * @returns {React.Portal} - Rendered modal using React portals
 */
const Modal = ({
  title,
  children,
  onCancelModal,
  onAcceptModal,
  acceptEnabled = true,
  isLoading = false,
}) => {
  return ReactDOM.createPortal(
    <div className="modal" role="dialog" aria-labelledby="modal-title">
      <header className="modal__header">
        <h1 id="modal-title">{title}</h1>
      </header>
      <div className="modal__content">{children}</div>
      <div className="modal__actions">
        <Button design="danger" mode="flat" onClick={onCancelModal}>
          Cancel
        </Button>
        <Button
          mode="raised"
          onClick={onAcceptModal}
          disabled={!acceptEnabled}
          loading={isLoading}
        >
          Accept
        </Button>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
