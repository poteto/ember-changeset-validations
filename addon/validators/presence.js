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
  isBlank
} = Ember;

function _isPresent(value) {
  if (value instanceof Ember.ObjectProxy || value instanceof Ember.ArrayProxy) {
    return _isPresent(get(value, 'content'));
  }

  return isPresent(value);
}

export default function validatePresence(opts) {
  return (key, value) => {
    if (opts) {
      return _isPresent(value) || buildMessage(key, 'present');
    } else {
      return isBlank(value) || buildMessage(key, 'blank');
    }
  };
}
