/**
 * Create a new object with defaults
 *
 * @public
 * @param  {Object} obj
 * @param  {Object} defaults
 * @return {Object}
 */
export default function withDefaults(obj = {}, defaults = {}) {
  return Object.assign(Object.assign({}, defaults), obj);
}
