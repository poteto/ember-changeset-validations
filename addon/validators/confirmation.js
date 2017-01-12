import Ember from 'ember';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';

const {
  get,
  isPresent,
  isEqual,
  isEmpty,
} = Ember;

export default function validateConfirmation(options = {}) {
  let { on, allowBlank } = options;

  return (key, newValue, _oldValue, changes/*, _content*/) => {
    if (allowBlank && isEmpty(newValue)) {
      return true;
    }

    return isPresent(newValue) && isEqual(get(changes, on), newValue) ||
      buildMessage(key, 'confirmation', newValue, options);
  };
}
