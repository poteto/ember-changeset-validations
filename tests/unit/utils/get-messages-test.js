import {
  getMessages,
  defaultMessages,
} from 'ember-changeset-validations/utils';
import { module, test } from 'qunit';

module('Unit | Utility | get messages', function () {
  test('it loads custom messages if defined', function (assert) {
    let messages = getMessages();

    // It has all the default messages
    Object.keys(defaultMessages).forEach((k) => {
      assert.ok(messages[k]);
    });

    // Check for custom message which means we loaded the right file
    assert.ok(messages.custom, 'It has the custom message');
  });

  test('it fallsback to default messages if not defined', function (assert) {
    let dummyModuleMap = {};
    assert.deepEqual(
      getMessages(dummyModuleMap, false),
      defaultMessages,
      'loads the correct module'
    );
  });
});
