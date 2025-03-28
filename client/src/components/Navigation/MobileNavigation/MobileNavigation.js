// external
import React from "react";

// components
import NavigationItems from "../NavigationItems/NavigationItems";
import Logo from "../../Logo/Logo";

// css
import "./MobileNavigation.css";

/**
 * MobileNavigation Component
 *
 * A reusable mobile navigation component that displays navigation items in a mobile-friendly layout.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the mobile navigation is open
 * @param {boolean} [props.mobile=false] - Whether the navigation is in mobile mode
 * @param {Function} props.onChooseItem - Callback function triggered when a navigation item is chosen
 * @param {boolean} props.isAuth - Whether the user is authenticated
 * @param {Function} props.onLogout - Callback function triggered when the logout action is performed
 * @returns {React.Element} - Rendered mobile navigation component
 */
const MobileNavigation = ({
  open,
  mobile = false,
  onChooseItem,
  isAuth,
  onLogout,
}) => {
  // Determine the class names based on props
  const mobileNavClasses = `mobile-nav ${open ? "open" : ""}`;
  const mobileNavItemsClasses = `mobile-nav__items ${mobile ? "mobile" : ""}`;

  return (
    <nav
      className={mobileNavClasses}
      role="navigation"
      aria-label="Mobile Navigation"
    >
      <div className="mobile-nav__logo">
        <Logo />
      </div>
      <ul className={mobileNavItemsClasses}>
        <NavigationItems
          mobile={mobile}
          onChoose={onChooseItem}
          isAuth={isAuth}
          onLogout={onLogout}
        />
      </ul>
    </nav>
  );
};

export default MobileNavigation;
