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
    return buildMessage(key, 'equalTo', opts);
  } else if (type === 'lt' && numValue >= expected) {
    return buildMessage(key, 'lessThan', opts);
  } else if (type === 'lte' && numValue > expected) {
    return buildMessage(key, 'lessThanOrEqualTo', opts);
  } else if (type === 'gt' && numValue <= expected) {
    return buildMessage(key, 'greaterThan', opts);
  } else if (type === 'gte' && numValue < expected) {
    return buildMessage(key, 'greaterThanOrEqualTo', opts);
  } else if (type === 'positive' && numValue < 0) {
    return buildMessage(key, 'positive', opts);
  } else if (type === 'odd' && numValue % 2 === 0) {
    return buildMessage(key, 'odd', opts);
  } else if (type === 'even' && numValue % 2 !== 0) {
    return buildMessage(key, 'even', opts);
  }

  return true;
}

export default function validateNumber(opts = {}) {
  return (key, value) => {
    let numValue = Number(value);
    let optKeys = keys(opts);

    if (opts.allowBlank && isEmpty(value)) {
      return true;
    }

    if (typeof(value) === 'string' && isEmpty(value)) {
      return buildMessage(key, 'notANumber');
    }

    if(!_isNumber(numValue)) {
      return buildMessage(key, 'notANumber', value);
    }

    if(isPresent(opts.integer) && !_isInteger(numValue)) {
      return buildMessage(key, 'notAnInteger', value);
    }

    for (let i = 0; i < optKeys.length; i++) {
      let type = optKeys[i];
      let m = _validateType(type, opts, numValue, key);

      if (typeof m === 'string') {
        return m;
      }
    }

    return true;
  };
}
