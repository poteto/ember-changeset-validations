/* globals requirejs, requireModule */
import Ember from 'ember';
import defaultMessages from 'ember-changeset-validations/utils/messages';

const { isPresent, isNone } = Ember;
const { keys } = Object;
const matchRegex = /validations\/messages$/gi;
let cachedKey = null;

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
  let cached = useCache && cachedKey;
  let moduleKey = cached || keys(moduleMap)
    .find((module) => isPresent(module.match(matchRegex)));

  if (useCache && isPresent(moduleKey) && isNone(cachedKey)) {
    cachedKey = moduleKey;
  }

  return isPresent(moduleKey) ? requireModule(moduleKey).default : defaultMessages;
}
