/**
 * For code taken from ember-cp-validations
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */

import Ember from 'ember';
import messages from 'ember-changeset-validations/validators/messages';

const {
  String: { dasherize, capitalize },
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

export default function buildMessage(key, type, context = {}) {
  let description = formatDescription(key);
  return formatMessage(get(messages, type), assign({ description }, context));
}
