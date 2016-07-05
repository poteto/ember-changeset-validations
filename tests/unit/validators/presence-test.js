import validatePresence from 'dummy/validators/presence';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | presence');

test('it accepts a `true` option', function(assert) {
  let key = 'firstName';
  let validator = validatePresence(true);

  assert.equal(validator(key, undefined), buildMessage(key, 'present'));
  assert.equal(validator(key, null), buildMessage(key, 'present'));
  assert.equal(validator(key, ''), buildMessage(key, 'present'));
  assert.equal(validator(key, 'a'), true);
});

test('it accepts a `false` option', function(assert) {
  let key = 'firstName';
  let validator = validatePresence(false);

  assert.equal(validator(key, undefined), true);
  assert.equal(validator(key, null), true);
  assert.equal(validator(key, ''), true);
  assert.equal(validator(key, 'a'), buildMessage(key, 'blank'));
});

test('it accepts a true `presence` option', function(assert) {
  let key = 'firstName';
  let validator = validatePresence({ presence: true });

  assert.equal(validator(key, undefined), buildMessage(key, 'present'));
  assert.equal(validator(key, null), buildMessage(key, 'present'));
  assert.equal(validator(key, ''), buildMessage(key, 'present'));
  assert.equal(validator(key, 'a'), true);
});

test('it accepts a false `presence` option', function(assert) {
  let key = 'firstName';
  let validator = validatePresence({ presence: false });

  assert.equal(validator(key, undefined), true);
  assert.equal(validator(key, null), true);
  assert.equal(validator(key, ''), true);
  assert.equal(validator(key, 'a'), buildMessage(key, 'blank'));
});

test('it can output a custom message string', function(assert) {
  let key = 'firstName';
  let options = { presence: true, message: '{description} should be present' };
  let validator = validatePresence(options);

  assert.equal(validator(key, ''), 'First name should be present', 'custom message string is generated correctly');
});

test('it can output a custom message function', function(assert) {
  assert.expect(5);

  let key = 'firstName';
  let options = {
    presence: false,
    message: function(_key, type, value, context) {
      assert.equal(_key, key);
      assert.equal(type, 'blank');
      assert.equal(value, 'test');
      assert.strictEqual(context.presence, false);

      return 'some test message';
    }
  };
  let validator = validatePresence(options);

  assert.equal(validator(key, 'test'), 'some test message', 'custom message function is returned correctly');
});
