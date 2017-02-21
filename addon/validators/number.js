/**
 * For code taken from ember-cp-validations
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import Ember from 'ember';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';

const {
  isPresent,
  isEmpty,
  typeOf
} = Ember;
const { keys } = Object;

function _isNumber(value) {
  return typeOf(value) === 'number' && !isNaN(value);
}

function _isInteger(value) {
  return typeOf(value) === 'number' && isFinite(value) && Math.floor(value) === value;
}

function _validateType(type, opts, numValue, key) {
  let expected = opts[type];

  if (type === 'is' && numValue !== expected) {
    return buildMessage(key, 'equalTo', numValue, opts);
  } else if (type === 'lt' && numValue >= expected) {
    return buildMessage(key, 'lessThan', numValue, opts);
  } else if (type === 'lte' && numValue > expected) {
    return buildMessage(key, 'lessThanOrEqualTo', numValue, opts);
  } else if (type === 'gt' && numValue <= expected) {
    return buildMessage(key, 'greaterThan', numValue, opts);
  } else if (type === 'gte' && numValue < expected) {
    return buildMessage(key, 'greaterThanOrEqualTo', numValue, opts);
  } else if (type === 'positive' && numValue < 0) {
    return buildMessage(key, 'positive', numValue, opts);
  } else if (type === 'odd' && numValue % 2 === 0) {
    return buildMessage(key, 'odd', numValue, opts);
  } else if (type === 'even' && numValue % 2 !== 0) {
    return buildMessage(key, 'even', numValue, opts);
  } else if (type === 'multipleOf' && !_isInteger(numValue / expected)) {
    return buildMessage(key, 'multipleOf', numValue, opts);
  }

  return true;
}

export default function validateNumber(options = {}) {
  return (key, value) => {
    if (isEmpty(value) && options.allowBlank) {
      return true;
    }

    let numValue = Number(value);

    if (isEmpty(value) || !_isNumber(numValue)) {
      return buildMessage(key, 'notANumber', value, options);
    } else if (isPresent(options.integer) && !_isInteger(numValue)) {
      return buildMessage(key, 'notAnInteger', value, options);
    }

    let optKeys = keys(options);

    for (let i = 0; i < optKeys.length; i++) {
      let type = optKeys[i];
      let m = _validateType(type, options, numValue, key);

      if (typeof m === 'string') {
        return m;
      }
    }

    return true;
  };
}
