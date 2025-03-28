// external
import React from "react";

// css
import "./Layout.css";

/**
 * Layout Component
 *
 * A reusable layout component that structures the main content of the application.
 * It includes a header, mobile navigation, and a main content area.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.header - The header content to display
 * @param {React.ReactNode} props.mobileNav - The mobile navigation content to display
 * @param {React.ReactNode} props.children - The main content to display
 * @returns {React.Element} - Rendered layout component
 */
const Layout = ({ header, mobileNav, children }) => {
  return (
    <>
      <header className="main-header" role="banner">
        {header}
      </header>
      {mobileNav}
      <main className="content" role="main">
        {children}
      </main>
    </>
  );
};

export default Layout;
