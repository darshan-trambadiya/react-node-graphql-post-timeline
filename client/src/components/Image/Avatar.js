// external
import React from "react";

// components
import Image from "./Image";

// css
import "./Avatar.css";

/**
 * Avatar Component
 *
 * A reusable avatar component that displays a user's profile image.
 *
 * @param {Object} props - Component props
 * @param {string} props.image - The URL of the avatar image
 * @param {number} [props.size=3] - The size of the avatar in rem units
 * @returns {React.Element} - Rendered avatar component
 */
const Avatar = ({ image, size = 3 }) => {
  return (
    <div
      className="avatar"
      style={{ width: `${size}rem`, height: `${size}rem` }}
      role="img"
      aria-label="User Avatar"
    >
      <Image imageUrl={image} />
    </div>
  );
};

export default Avatar;
