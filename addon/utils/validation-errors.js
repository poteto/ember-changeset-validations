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

  if (result.message) {
    return result.message;
  }

  let { type, value, context = {} } = result;

  if (context.message) {
    let message = context.message;

    if (typeOf(message) === 'function') {
      let builtMessage = message(key, type, value, context);
      assert('Custom message function must return a string', typeOf(builtMessage) === 'string');

      return builtMessage;
    }

    return messages.formatMessage(message, assign({ description }, context));
  }

  return messages.formatMessage(get(messages, type), assign({ description }, context));
}
