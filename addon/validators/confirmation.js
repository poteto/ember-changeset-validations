import Ember from 'ember';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';

const {
  get,
  isPresent,
  isEqual
} = Ember;

export default function validateConfirmation({ on }) {
  return (key, newValue, _oldValue, changes) => {
    return isPresent(newValue) && isEqual(get(changes, on), newValue) ||
      buildMessage(key, 'confirmation', { on });
  };
}
