import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import evValidateExclusion from 'ember-validators/exclusion';

export default function validateExclusion(options = {}) {
  if (options.list) {
    options.in = options.list;
  }

  return (key, value) => {
    let result = evValidateExclusion(value, options, null, key);
    return result === true ? true : buildMessage(key, result);
  };
}
