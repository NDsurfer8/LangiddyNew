import { validate } from "validate.js";

export const validateLength = (id, value, minLength, maxLength, allowEmpty) => {
  const constraints = {
    presence: { allowEmpty },
  }; // presence is a constraint
  if (!allowEmpty && value !== "") {
    constraints.length = {};
    if (minLength !== undefined) {
      constraints.length.minimum = minLength;
    }
    if (maxLength !== undefined) {
      constraints.length.maximum = maxLength;
    }
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  return validationResult && validationResult[id];
};

export const validateString = (id, value) => {
  // minimum of two characters
  const constraints = {
    presence: { allowEmpty: false },

    length: {
      minimum: 2,
      message: "must be at least 2 characters",
    },
  }; // presence is a constraint

  if (value !== "") {
    constraints.format = {
      pattern: "[a-z-]+",
      flags: "i",
      message: "can only contain a-z and -",
    }; // format is a constraint
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  return validationResult && validationResult[id];
};

export const validateStringTwo = (id, value) => {
  const constraints = {
    presence: { allowEmpty: true },
  }; // presence is a constraint
  if (value !== "") {
    constraints.length = {
      minimum: 2,
      message: "must be at least 2 characters",
    };
  }

  if (value !== "" || value === null) {
    constraints.format = {
      pattern: "[a-z-]+",
      flags: "i",
      message: "Spaces?",
    }; // format is a constraint
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  return validationResult && validationResult[id];
};

export const validateEmail = (id, value) => {
  const constraints = {
    presence: { allowEmpty: false },
  }; // presence is a constraint

  if (value !== "") {
    constraints.email = true; // email is a constraint
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  return validationResult && validationResult[id];
};

export const validatePassword = (id, value) => {
  const constraints = {
    presence: { allowEmpty: false },
  }; // presence is a constraint

  if (value !== "") {
    constraints.length = {
      minimum: 6,
      message: "must be at least 6 characters",
    };
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  return validationResult && validationResult[id];
};
