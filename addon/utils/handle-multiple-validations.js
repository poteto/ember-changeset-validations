import Ember from 'ember';
import isPromise from 'ember-changeset/utils/is-promise';

const {
  A: emberArray,
  RSVP: { all },
  get,
  typeOf
} = Ember;

/**
 * Rejects `true` values from an array of validations. Returns `true` when there
 * are no errors, or the error object if there are errors.
 *
 * @private
 * @param  {Array} validations
 * @return {Boolean|Any}
 */
function handleValidations(validations = []) {
  let rejectedValidations = emberArray(validations)
    .reject((validation) => typeOf(validation) === 'boolean' && validation);

  return get(rejectedValidations, 'length') === 0 || rejectedValidations;
}

/**
 * Handles an array of validators and returns Promise.all if any value is a
 * Promise.
 *
 * @public
 * @param  {Array} validators Array of validator functions
 * @param  {String} options.key
 * @param  {Any} options.newValue
 * @param  {Any} options.oldValue
 * @param  {Object} options.changes
 * @param  {Object} options.content
 * @return {Promise|Boolean|Any}
 */
export default function handleMultipleValidations(validators, { key, newValue, oldValue, changes, content }) {
  let validations = emberArray(validators
    .map((validator) => validator(key, newValue, oldValue, changes, content)));

  if (emberArray(validations).any(isPromise)) {
    return all(validations).then(handleValidations);
  }

  return handleValidations(validations);
}
