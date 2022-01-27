import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import evValidateConfirmation from 'ember-validators/confirmation';

export default function validateConfirmation(options = {}) {
  return (key, newValue, _oldValue, changes, content = {}) => {
    // Combine the changes on top of the content so that we evaluate against both default values
    // and valid changes. `changes` only has valid changes that have been made and won't include
    // default values
    let model = Object.assign({}, content, changes);

    let result = evValidateConfirmation(newValue, options, model, key);
    return result === true ? true : buildMessage(key, result);
  };
}
