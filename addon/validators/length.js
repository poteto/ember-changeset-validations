import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import withDefaults from 'ember-changeset-validations/utils/with-defaults';
import evValidateLength from 'ember-validators/length';

export default function validateLength(options = {}) {
  options = withDefaults(options, { useBetweenMessage: true });

  return (key, value) => {
    let result = evValidateLength(value, options, null, key);
    return result === true ? true : buildMessage(key, result);
  };
}
