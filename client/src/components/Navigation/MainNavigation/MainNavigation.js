// external
import React from "react";
import { NavLink } from "react-router";

// components
import MobileToggle from "../MobileToggle/MobileToggle";
import Logo from "../../Logo/Logo";
import NavigationItems from "../NavigationItems/NavigationItems";

// css
import "./MainNavigation.css";

/**
 * MainNavigation Component
 *
 * A reusable navigation component that includes a logo, mobile toggle, and navigation items.
 *
 * @param {Object} props - Component props
 * @param {Function} props.onOpenMobileNav - Callback function triggered when the mobile navigation is opened
 * @param {boolean} props.isAuth - Whether the user is authenticated
 * @param {Function} props.onLogout - Callback function triggered when the logout action is performed
 * @returns {React.Element} - Rendered main navigation component
 */
const MainNavigation = ({ onOpenMobileNav, isAuth, onLogout }) => {
  return (
    <nav className="main-nav" role="navigation" aria-label="Main Navigation">
      <MobileToggle onOpen={onOpenMobileNav} />
      <div className="main-nav__logo">
        <NavLink to="/" aria-label="Home">
          <Logo />
        </NavLink>
      </div>
      <div className="spacer" />
      <ul className="main-nav__items">
        <NavigationItems isAuth={isAuth} onLogout={onLogout} />
      </ul>
    </nav>
  );
};

export default MainNavigation;
