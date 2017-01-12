/**
 * For code taken from ember-cp-validations
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import Ember from 'ember';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';

const { isEmpty, typeOf } = Ember;

export default function validateInclusion(options = {}) {
  let { list, range, allowBlank } = options;

  return (key, value) => {
    if (allowBlank && isEmpty(value)) {
      return true;
    }

    if (list && list.indexOf(value) === -1) {
      return buildMessage(key, 'inclusion', value, options);
    }

    if (range && range.length === 2) {
      let [min, max] = range;
      let equalType = typeOf(value) === typeOf(min) && typeOf(value) === typeOf(max);

      if (!equalType || min > value || value > max) {
        return buildMessage(key, 'inclusion', value, options);
      }
    }

    return true;
  };
}
