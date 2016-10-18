import Ember from 'ember';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';

const {
  get,
  isPresent,
  isEqual
} = Ember;

export default function validateConfirmation(options = {}) {
  let { on } = options;

  return (key, newValue, _oldValue, changes/*, _content*/) => {
    return isPresent(newValue) && isEqual(get(changes, on), newValue) ||
      buildMessage(key, 'confirmation', newValue, options);
  };
}
