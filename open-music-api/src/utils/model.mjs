/**
 * @param {Record<string, string>} definition
 * @param {Record<string, any>} data
 */
export const mapKeys = (definition, data) => Object.fromEntries(
  Object.entries(data).map(([key, value]) => [definition[key] || key, value]),
);
