// @ts-nocheck
export const stringToArray = (input = "") => {
  if (typeof input !== "string") return "";
  return input
    .split(",")
    .map((id) => `'${id.trim()}'`)
    .filter((id) => id !== "''")
    .join(",");
};

export const arrayToString = (input = []) => {
  if (!Array.isArray(input)) return "";
  return input
    .filter((item) => typeof item === "string" && item.trim() !== "")
    .map((item) => `'${item.trim()}'`)
    .join(",");
};

export const removeSpaceFromString = (input = "") => {
  if (typeof input !== "string") return "";
  return input
    .split(",")
    .map((id) => `'${id.trim()}'`)
    .filter((id) => id !== "''")
    .join(",");
};

export const toArray = (value) => {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  if (Array.isArray(value)) {
    return value;
  }
  return [];
};

export const getPublicClientIp = (req) => {
  // Try headers in order of preference
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip ||
    'Unknown'
  );
};
