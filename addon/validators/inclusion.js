import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { validate } from 'ember-validators';

export default function validateInclusion(options = {}) {
  if (options.list) {
    options.in = options.list;
  }

  return (key, value) => {
    let result = validate('inclusion', value, options, null, key);
    return (result === true) ? true : buildMessage(key, result);
  };
}
