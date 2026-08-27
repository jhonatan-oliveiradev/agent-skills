export const forbiddenPrivatePatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\b(?:sk|sk-proj)-[A-Za-z0-9_-]{20,}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}\b/,
  /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  /https?:\/\/(?:[^\s/]+\.)?internal(?:[./:]|\b)/i,
];

export function containsForbiddenPrivateData(text) {
  return forbiddenPrivatePatterns.some((pattern) => pattern.test(text));
}
