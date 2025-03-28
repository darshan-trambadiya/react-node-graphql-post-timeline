// external
import React from "react";

// css
import "./Auth.css";

/**
 * Auth Component
 *
 * A reusable authentication form container component that wraps its children in a styled section.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The content to display within the authentication form
 * @returns {React.Element} - Rendered authentication form component
 */
const Auth = ({ children }) => {
  return (
    <section className="auth-form" role="form" aria-label="Authentication Form">
      {children}
    </section>
  );
};

export default Auth;
