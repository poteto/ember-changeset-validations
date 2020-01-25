import { isEmpty } from '@ember/utils';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { validate } from 'ember-validators';

export default function validateInclusion(options = {}) {
  let hasOptions = !isEmpty(Object.keys(options));

  return (key, value) => {
    if (!hasOptions) {
      return true;
    }

    let result = validate('format', value, options, null, key);
    return (result === true) ? true : buildMessage(key, result);
  };
}
