export const removeEmptyFields = (obj) => {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (
      value === null ||
      value === undefined ||
      (typeof value === "string" && value.trim() === "")
    ) {
      return acc;
    }

    if (typeof value === "object" && !Array.isArray(value)) {
      const cleaned = removeEmptyFields(value);
      if (Object.keys(cleaned).length > 0) {
        acc[key] = cleaned;
      }
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
};
