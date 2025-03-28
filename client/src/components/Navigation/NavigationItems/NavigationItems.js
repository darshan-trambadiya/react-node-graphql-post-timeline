// external
import React from "react";
import { NavLink } from "react-router";

// css
import "./NavigationItems.css";

/**
 * NavigationItems Component
 *
 * A reusable component that renders navigation items based on authentication status.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isAuth - Whether the user is authenticated
 * @param {boolean} [props.mobile=false] - Whether the navigation is in mobile mode
 * @param {Function} [props.onChoose] - Callback function triggered when a navigation item is chosen
 * @param {Function} [props.onLogout] - Callback function triggered when the logout action is performed
 * @returns {React.Element[]} - Rendered list of navigation items
 */
const NavigationItems = ({ isAuth, mobile = false, onChoose, onLogout }) => {
  // Define navigation items based on authentication status
  const navItems = [
    { id: "feed", text: "Feed", link: "/", auth: true },
    { id: "login", text: "Login", link: "/", auth: false },
    { id: "signup", text: "Signup", link: "/signup", auth: false },
  ];

  return [
    // Render navigation items based on authentication status
    ...navItems
      .filter((item) => item.auth === isAuth)
      .map((item) => (
        <li
          key={item.id}
          className={`navigation-item ${mobile ? "mobile" : ""}`}
        >
          <NavLink to={item.link} onClick={onChoose} aria-current="page">
            {item.text}
          </NavLink>
        </li>
      )),
    // Render logout button if authenticated
    isAuth && (
      <li className="navigation-item" key="logout">
        <button onClick={onLogout} aria-label="Logout">
          Logout
        </button>
      </li>
    ),
  ];
};

export default NavigationItems;
