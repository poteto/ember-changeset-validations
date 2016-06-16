import Ember from 'ember';

const {
  A: emberArray,
  isEmpty,
  isArray,
  get,
  typeOf
} = Ember;

export default function lookupValidator(validationMap = {}) {
  return (key, newValue, oldValue, changes) => {
    let validator = validationMap[key];

    if (isEmpty(validator)) {
      return;
    }

    if (isArray(validator)) {
      let validations = emberArray(validator
        .map((subValidator) => subValidator(key, newValue, oldValue, changes)))
        .reject((validation) => typeOf(validation) === 'boolean' && validation);

      return get(validations, 'length') === 0 || validations;
    }

    return [validator(key, newValue, oldValue, changes)];
  };
}
