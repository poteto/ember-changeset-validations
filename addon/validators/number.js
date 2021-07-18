import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import withDefaults from 'ember-changeset-validations/utils/with-defaults';
import evValidateNumber from 'ember-validators/number';

export default function validateNumber(options = {}) {
  options = withDefaults(options, { allowString: true, allowNone: false });

  if (options.allowBlank) {
    options.allowNone = true;
  }

  return (key, value) => {
    let result = evValidateNumber(value, options, null, key);
    return result === true ? true : buildMessage(key, result);
  };
}
