/**
 * Generates a Base64 string from an image file.
 *
 * @param {File} imageFile - The image file to convert to a Base64 string.
 * @returns {Promise<string>} - A promise that resolves with the Base64 string of the image.
 * @throws {Error} - If the file reading fails.
 */
export const generateBase64FromImage = (imageFile) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // Handle successful file reading
    reader.onload = (e) => {
      resolve(e.target.result);
    };

    // Handle file reading errors
    reader.onerror = (err) => {
      reject(new Error("Failed to read the image file."));
    };

    // Read the image file as a Data URL (Base64)
    reader.readAsDataURL(imageFile);
  });
};
