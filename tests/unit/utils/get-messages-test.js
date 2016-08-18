import getMessages from 'ember-changeset-validations/utils/get-messages';
import customMessages from 'dummy/validations/messages';
import defaultMessages from 'ember-changeset-validations/utils/messages';
import { module, test } from 'qunit';

module('Unit | Utility | get messages');

test('it loads custom messages if defined', function(assert) {
  assert.deepEqual(getMessages(), customMessages, 'loads the correct module');
});

test('it fallsback to default messages if not defined', function(assert) {
  let dummyModuleMap = {};
  assert.deepEqual(getMessages(dummyModuleMap, false), defaultMessages, 'loads the correct module');
});
