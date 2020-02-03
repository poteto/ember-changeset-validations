import { isEmpty } from '@ember/utils';
import { isArray } from '@ember/array';
import wrapInArray from 'ember-changeset-validations/utils/wrap';
import handleMultipleValidations from 'ember-changeset-validations/utils/handle-multiple-validations';
import { isPromise } from 'validated-changeset';

export default function lookupValidator(validationMap = {}) {
  return ({ key, newValue, oldValue, changes, content }) => {
    let validator = validationMap[key];

    if (isEmpty(validator)) {
      return true;
    }

    if (isArray(validator)) {
      return handleMultipleValidations(validator, { key, newValue, oldValue, changes, content });
    }

    let validation = validator(key, newValue, oldValue, changes, content);

    return isPromise(validation) ? validation.then(wrapInArray) : [validation];
  };
}
