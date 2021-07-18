/**
 * @name toDate
 * @param {Date|Number} argument - the value to convert
 * @returns {Date} the parsed date in the local time zone
 * @throws {TypeError} 1 argument required
 */
export default function toDate(argument) {
  const argStr = Object.prototype.toString.call(argument);

  if (typeof argument === 'function') {
    argument = argument();
  }

  if (
    argument instanceof Date ||
    (typeof argument === 'object' && argStr === '[object Date]')
  ) {
    return argument;
  } else if (typeof argument === 'number' || argStr === '[object Number]') {
    return new Date(argument);
  } else {
    if (
      (typeof argument === 'string' || argStr === '[object String]') &&
      typeof console !== 'undefined'
    ) {
      // eslint-disable-next-line no-console
      console.warn('Please use `Date.parse` to parse strings.');
      // eslint-disable-next-line no-console
      console.warn(new Error().stack);
    }
    return new Date(NaN);
  }
}
