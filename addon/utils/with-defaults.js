import Ember from 'ember';

const assign = Ember.merge || Ember.assign;

/**
 * Create a new object with defaults
 *
 * @public
 * @param  {Object} obj
 * @param  {Object} defaults
 * @return {Object}
 */
export default function withDefaults(obj = {}, defaults = {}) {
  return assign(assign({}, defaults), obj);
}
