/**
 * Converts an error object or string to a string format.
 * If the input is a string, it converts it to uppercase.
 * If the input is an Error object, it returns the error message.
 * @param {unknown} e - The error object or string to convert.
 * @returns {string} The error message in string format.
 */
const errorToString = (e: unknown): string => {
  let err: string = "";
  if (typeof e === "string") {
    err = e.toUpperCase();
  } else if (e instanceof Error) {
    err = e.message;
  }
  return err;
};

export { errorToString };

/**
 * Check if the given string contains any space character.
 * @param {string} value - The string to check for spaces.
 * @returns {boolean} True if the string contains a space, false otherwise.
 */
const isContainSpace = (value: string): boolean => {
  return !value.includes(" ");
};

export { isContainSpace };
