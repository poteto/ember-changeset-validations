/**
 * For code taken from ember-cp-validations
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';

const {
  get,
  isPresent,
  isEmpty,
  isNone,
  typeOf
} = Ember;

export default function validateLength({ allowBlank, is, min, max } = {}) {
  return (key, value) => {
    let length = get(value, 'length');

    if (allowBlank && isEmpty(value)) {
      return true;
    }

    if (isNone(value)) {
      return buildMessage(key, 'invalid', value);
    }

    if (isPresent(is) && typeOf(is) === 'number') {
      return length === is || buildMessage(key, 'wrongLength', { is });
    }

    if (isPresent(min) && isPresent(max)) {
      return (length >= min && length <= max) || buildMessage(key, 'between', { min, max });
    }

    if (isPresent(min) && isEmpty(max)) {
      return length >= min || buildMessage(key, 'tooShort', { min });
    }

    if (isPresent(max) && isEmpty(min)) {
      return length <= max || buildMessage(key, 'tooLong', { max });
    }

    return true;
  };
}
