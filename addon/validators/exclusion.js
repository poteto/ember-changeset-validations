/**
 * For code taken from ember-cp-validations
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';

const { typeOf } = Ember;

export default function validateExclusion(options = {}) {
  let { list, range } = options;

  return (key, value) => {
    if (list && list.indexOf(value) !== -1) {
      return buildMessage(key, 'exclusion', value, options);
    }

    if (range && range.length === 2) {
      let [min, max] = range;
      let equalType = typeOf(value) === typeOf(min) && typeOf(value) === typeOf(max);

      if (equalType && min <= value && value <= max) {
        return buildMessage(key, 'exclusion', value, options);
      }
    }

    return true;
  };
}
