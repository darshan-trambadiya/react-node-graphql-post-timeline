// external
import React from "react";

// css
import "./Image.css";

/**
 * Image Component
 *
 * A reusable image component that displays an image using a background image style.
 *
 * @param {Object} props - Component props
 * @param {string} props.imageUrl - The URL of the image to display
 * @param {boolean} [props.contain=false] - Whether the image should be contained within the element
 * @param {boolean} [props.left=false] - Whether the image should be aligned to the left
 * @returns {React.Element} - Rendered image component
 */
const Image = ({ imageUrl, contain = false, left = false }) => {
  // Determine the background size and position based on props
  const backgroundSize = contain ? "contain" : "cover";
  const backgroundPosition = left ? "left" : "center";

  return (
    <div
      className="image"
      style={{
        backgroundImage: `url('${imageUrl}')`,
        backgroundSize,
        backgroundPosition,
      }}
      role="img"
      aria-label="Image"
    />
  );
};

export default Image;
