import {
  validateEmail,
  validateLength,
  validatePassword,
  validateString,
  validateStringTwo,
} from "../validationConstraints";

export const validateInput = (inputId, inputValue) => {
  if (inputId === "firstName" || inputId === "lastName") {
    return validateString(inputId, inputValue);
  }
  if (inputId === "email") {
    return validateEmail(inputId, inputValue);
  }
  if (inputId === "password") {
    return validatePassword(inputId, inputValue);
  }
  if (inputId === "about") {
    return validateLength(inputId, inputValue, 0, 100, true);
  }
  if (inputId === "language") {
    return validateString(inputId, inputValue);
  }
  if (inputId === "languageFrom") {
    return validateString(inputId, inputValue);
  }
  if (inputId === "languageTwo") {
    return validateStringTwo(inputId, inputValue);
  }
  if (inputId === "relationshipStatus") {
    return validateLength(inputId, inputValue);
  }
};
