/**
 * Validates that a value is not empty after trimming.
 *
 * @param {string} value - The value to validate.
 * @returns {boolean} - True if the value is not empty, otherwise false.
 */
export const required = (value) => value.trim() !== "";

/**
 * Validates the length of a value based on the provided configuration.
 *
 * @param {Object} config - Configuration object with `min` and/or `max` properties.
 * @param {number} [config.min] - The minimum allowed length.
 * @param {number} [config.max] - The maximum allowed length.
 * @returns {Function} - A function that takes a value and returns true if the length is valid, otherwise false.
 */
export const length = (config) => (value) => {
  let isValid = true;
  if (config.min) {
    isValid = isValid && value.trim().length >= config.min;
  }
  if (config.max) {
    isValid = isValid && value.trim().length <= config.max;
  }
  return isValid;
};

/**
 * Validates that a value is a valid email address.
 *
 * @param {string} value - The value to validate.
 * @returns {boolean} - True if the value is a valid email address, otherwise false.
 */
export const email = (value) =>
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    value
  );
