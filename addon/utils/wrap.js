import Ember from 'ember';

const {
  A: emberArray,
  isArray
} = Ember;

/**
 * Wraps a value in an Ember.Array.
 *
 * @public
 * @param  {Any} value
 * @return {Ember.Array}
 */
export default function wrapInArray(value) {
  if (isArray(value)) {
    return emberArray(value);
  }

  return emberArray([value]);
}
