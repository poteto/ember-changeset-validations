/**
 * For code taken from ember-cp-validations
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import Ember from 'ember';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';

const { isEmpty, assert, typeOf } = Ember;
const regularExpressions = {
  email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phone: /^([\+]?1\s*[-\/\.]?\s*)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT]?[\.]?|extension)\s*([#*\d]+))*$/,
  url: /(?:([A-Za-z]+):)?(\/{0,3})[a-zA-Z0-9][a-zA-Z-0-9]*(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-{}]*[\w@?^=%&amp;\/~+#-{}])??/
};

export default function validateFormat(options = {}) {
  let { allowBlank, type, regex, inverse = false } = options;

  assert('inverse options should be a boolean', typeOf(inverse) === 'boolean');

  return (key, value) => {
    if (allowBlank && isEmpty(value)) {
      return true;
    }

    if(!regex && type) {
      regex = regularExpressions[type];
    }

    if (regex && (regex.test(value) === inverse)) {
      if (type && !inverse) {
        return buildMessage(key, type, value, options);
      }
      return buildMessage(key, 'invalid', value, options);
    }

    return true;
  };
}
