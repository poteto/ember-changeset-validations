import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { validate } from 'ember-validators';

export default function validateConfirmation(options = {}) {
  return (key, newValue, _oldValue, changes/*, _content*/) => {
    let result = validate('confirmation', newValue, options, changes, key);
    return (result === true) ? true : buildMessage(key, result);
  };
}
