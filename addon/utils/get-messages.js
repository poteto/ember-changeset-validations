/* globals requirejs, requireModule */
import { A as emberArray } from '@ember/array';

import { isPresent } from '@ember/utils';
import config from 'ember-get-config';
import defaultMessages from 'ember-changeset-validations/utils/messages';
import withDefaults from 'ember-changeset-validations/utils/with-defaults';

const { keys } = Object;
const moduleName = `${config.modulePrefix}/validations/messages`;

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
export default function getMessages(
  moduleMap = requirejs.entries,
  useCache = true
) {
  let messagesModule = defaultMessages;

  if (useCache && isPresent(cachedRef)) {
    return cachedRef;
  }

  let moduleKey = emberArray(keys(moduleMap)).find((key) => key === moduleName);

  if (isPresent(moduleKey)) {
    // Merge the user specified messages with the defaults
    messagesModule = withDefaults(
      requireModule(moduleKey).default,
      messagesModule
    );
  }

  cachedRef = messagesModule;
  return messagesModule;
}
