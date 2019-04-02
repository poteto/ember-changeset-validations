import validateLength from 'ember-changeset-validations/validators/length';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | length');

test('it accepts a `min` option', function(assert) {
  let key = 'firstName';
  let options = { min: 1 };
  let validator = validateLength(options);

  assert.equal(validator(key, ''), buildMessage(key, 'tooShort', '', options));
  assert.equal(validator(key, 'a'), true);
});

test('it accepts a `max` option', function(assert) {
  let key = 'firstName';
  let options = { max: 1 };
  let validator = validateLength(options);

  assert.equal(validator(key, ''), true);
  assert.equal(validator(key, 'a'), true);
  assert.equal(validator(key, 'ab'), buildMessage(key, 'tooLong', 'ab', options));
});

test('it accepts a `min` and `max` option', function(assert) {
  let key = 'firstName';
  let options = { min: 1, max: 3 };
  let validator = validateLength(options);

  assert.equal(validator(key, ''), buildMessage(key, 'between', '', options));
  assert.equal(validator(key, 'a'), true);
  assert.equal(validator(key, 'ab'), true);
  assert.equal(validator(key, 'abc'), true);
  assert.equal(validator(key, 'abcd'), buildMessage(key, 'between', '', options));
});

test('it accepts an `is` option', function(assert) {
  let key = 'firstName';
  let options = { is: 2 };
  let validator = validateLength(options);

  assert.equal(validator(key, 'a'), buildMessage(key, 'wrongLength', '', options));
  assert.equal(validator(key, 'ab'), true);
  assert.equal(validator(key, 'abc'), buildMessage(key, 'wrongLength', '', options));
});

test('it accepts an `allowBlank` option', function(assert) {
  let key = 'firstName';
  let options = { allowBlank: true };
  let validator = validateLength(options);

  assert.equal(validator(key, ''), true);
  assert.equal(validator(key, 'a'), true);
  assert.equal(validator(key, null), true);
  assert.equal(validator(key, undefined), true);
});

test('it can output custom message string', function(assert) {
  let key = 'firstName';
  let options = { is: 2, message: '{description} should be length {is}' };
  let validator = validateLength(options);

  assert.equal(validator(key, 'abc'), 'First name should be length 2', 'custom messsage string is generated correctly');
});

test('it can output custom message function', function(assert) {
  assert.expect(5);

  let key = 'firstName';
  let options = {
    is: 2,
    message: function (_key, type, value, context) {
      assert.equal(_key, key);
      assert.equal(type, 'wrongLength');
      assert.equal(value, 'abc');
      assert.equal(context.is, 2);

      return 'some test message';
    }
  };
  let validator = validateLength(options);

  assert.equal(validator(key, 'abc'), 'some test message', 'custom message function is returned correctly');
});
