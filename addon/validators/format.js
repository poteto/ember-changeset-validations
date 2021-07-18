import { isEmpty } from '@ember/utils';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import evValidateFormat from 'ember-validators/format';

export default function validateFormat(options = {}) {
  let hasOptions = !isEmpty(Object.keys(options));

  return (key, value) => {
    if (!hasOptions) {
      return true;
    }

    let result = evValidateFormat(value, options, null, key);
    return result === true ? true : buildMessage(key, result);
  };
}
