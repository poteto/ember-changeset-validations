/* globals requirejs, requireModule */
import Ember from 'ember';
import defaultMessages from 'ember-changeset-validations/utils/messages';

const { isPresent } = Ember;
const { keys } = Object;
const matchRegex = /validations\/messages$/gi;
let cachedRef = null;

/**
 * Find and load messages module on consuming app. Defaults to addon messages.
 * To define a custom message map, create `my-app/app/validations/messages.js`
 * and export an object.
 *
 * @param  {Object} moduleMap
 * @param  {Boolean} useCache Pass `false` to ignore cached key
 * @return {Object}
 */
export default function getMessages(moduleMap = requirejs.entries, useCache = true) {
  if (useCache && isPresent(cachedRef)) {
    return cachedRef;
  }

  let moduleKey = keys(moduleMap)
    .find((module) => isPresent(module.match(matchRegex)));
  let messagesModule = isPresent(moduleKey) ? requireModule(moduleKey).default : defaultMessages;
  cachedRef = messagesModule;

  return messagesModule;
}
