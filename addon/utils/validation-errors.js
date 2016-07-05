/**
 * For code taken from ember-cp-validations
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import messages from 'ember-changeset-validations/validators/messages';

const {
  String: { dasherize, capitalize },
  assert,
  typeOf,
  isNone,
  get
} = Ember;
const assign = Ember.assign || Ember.merge;
const regex = /\{(\w+)\}/g;

export function formatDescription(key = '') {
  return capitalize(dasherize(key).split(/[_-]/g).join(' '));
}

export function formatMessage(message, context = {}) {
  if (isNone(message) || typeof message !== 'string') {
    return 'is invalid';
  }

  return message.replace(regex, (s, attr) => context[attr]);
}

export default function buildMessage(key, type, value, context = {}) {
  let description = formatDescription(key);

  if (context.message) {
    let message = context.message;

    if (typeOf(message) === 'function') {
      let builtMessage = message(key, type, value, context);
      assert('Custom message function must return a string', typeOf(builtMessage) === 'string');

      return builtMessage;
    }

    return formatMessage(message, assign({ description }, context));
  }

  return formatMessage(get(messages, type), assign({ description }, context));
}
