'use strict';

// Character map to encode numbers
const CHAR_MAP = "oQBARvVIcD70guaiZkNUObP6EfTFsGL=2d_KhtWeywXlj498CqmJnMHxY1S3pzr5";
const BASE = CHAR_MAP.length;


/**
 * Transform a number to its string representation
 * @param {number} number 
 */
function encode(number) {
  let string = "";
  while (number > 0) {
    const nextChar = CHAR_MAP.charAt(number % BASE);
    string = `${nextChar}${string}`;
    number = Math.floor(number / BASE);
  }

  return string;
}

/**
 * Transform a string to its number representaion
 * @param {number} number 
 */
function decode(str) {
  let number = 0;
  const length = str.length;

  if(!length) return -1;

  for (let i = 0; i < length; ++i) {
    const index = CHAR_MAP.indexOf(str.charAt(i));
    if (index === -1) {
      number = -1;
      break;
    }
    number = number * BASE + index;
  }

  return number;
}

module.exports = { encode, decode };
