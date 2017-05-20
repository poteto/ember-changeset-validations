/**
 * For code taken from ember-cp-validations
 * Copyright 2016, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
import Ember from 'ember';
import getMessages from 'ember-changeset-validations/utils/get-messages';

const {
  assert,
  typeOf,
  get
} = Ember;

const assign = Ember.assign || Ember.merge;

export default function buildMessage(key, result) {
  let messages = getMessages();
  let description = messages.getDescriptionFor(key);
  let { type, value, context = {} } = result;
  let message;

  if (context.message || result.message) {
    message = context.message || result.message;
  } else {
    message = get(messages, type);
  }

  if (typeOf(message) === 'function') {
    let builtMessage = message(key, type, value, context);
    assert('Custom message function must return a string', typeOf(builtMessage) === 'string');

    return messages.formatMessage(builtMessage, assign({ description }, context));
  }

  return messages.formatMessage(message, assign({ description }, context));
}
