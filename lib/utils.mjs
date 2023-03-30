import { format } from 'util';

/**
 * @param {any} value
 * @param {Error} err
 */
export function assert(value, err) {
  if (!value) {
    throw err;
  }
}

/**
 * @param {Number} num
 * @returns {String}
 */
function printNum(num) {
  return num < 10 ? `0${num}` : num.toString();
}

/**
 * @param {Date} date
 * @returns {String}
 */
export function getApiGatewayReqTime(date) {
  // dd/MMM/yyyy:HH:mm:ss xxxx
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return format('%s/%s/%s:%s:%s:%s', ...[
    printNum(date.getDate()), months[date.getMonth()], date.getFullYear(),
    printNum(date.getHours()), printNum(date.getMinutes()), printNum(date.getSeconds()), '+0000',
  ]);
}

/**
 * @param {Date} date
 * @returns {String}
 */
export function getContextLogStreamTime(date) {
  return format('%s/%s/%s', date.getFullYear(), printNum(date.getMonth() + 1), printNum(date.getDate()));
}

/**
 * @param {*} input
 * @returns {Boolean}
 */
export function isPlainObject(input) {
  return Object.prototype.toString.call(input) === '[object Object]';
}
