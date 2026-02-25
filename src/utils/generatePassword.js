const DEFAULT_MIN = 6;
const DEFAULT_MAX = 10;
const ALPHANUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function secureRandomInt(max) {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  // Fallback
  return Math.floor(Math.random() * max);
}

/**
 * generatePassword
 * @param {number} [length] - If provided, uses this exact length. Otherwise picks a length between 6 and 10.
 * @returns {string} Alphanumeric string
 */
export default function generatePassword(length) {
  const len = (typeof length === 'number' && length > 0)
    ? Math.floor(length)
    : Math.floor(Math.random() * (DEFAULT_MAX - DEFAULT_MIN + 1)) + DEFAULT_MIN;

  let out = '';
  for (let i = 0; i < len; i++) {
    out += ALPHANUM.charAt(secureRandomInt(ALPHANUM.length));
  }
  return out;
}

export { generatePassword };

