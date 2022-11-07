import validateLength from 'ember-changeset-validations/validators/length';
import { buildMessage } from 'ember-changeset-validations/utils';
import { module, test } from 'qunit';

module('Unit | Validator | length', function () {
  test('it accepts a `min` option', function (assert) {
    let key = 'firstName';
    let options = { min: 1 };
    let validator = validateLength(options);

    assert.strictEqual(
      validator(key, ''),
      buildMessage(key, { type: 'tooShort', value: '', context: options })
    );
    assert.true(validator(key, 'a'));
  });

  test('it accepts a `max` option', function (assert) {
    let key = 'firstName';
    let options = { max: 1 };
    let validator = validateLength(options);

    assert.true(validator(key, ''));
    assert.true(validator(key, 'a'));
    assert.strictEqual(
      validator(key, 'ab'),
      buildMessage(key, { type: 'tooLong', value: 'ab', context: options })
    );
  });

  test('it accepts a `min` and `max` option', function (assert) {
    let key = 'firstName';
    let options = { min: 1, max: 3 };
    let validator = validateLength(options);

    assert.strictEqual(
      validator(key, ''),
      buildMessage(key, { type: 'between', value: '', context: options })
    );
    assert.true(validator(key, 'a'));
    assert.true(validator(key, 'ab'));
    assert.true(validator(key, 'abc'));
    assert.strictEqual(
      validator(key, 'abcd'),
      buildMessage(key, { type: 'between', value: '', context: options })
    );
  });

  test('it accepts an `is` option', function (assert) {
    let key = 'firstName';
    let options = { is: 2 };
    let validator = validateLength(options);

    assert.strictEqual(
      validator(key, 'a'),
      buildMessage(key, { type: 'wrongLength', value: '', context: options })
    );
    assert.true(validator(key, 'ab'));
    assert.strictEqual(
      validator(key, 'abc'),
      buildMessage(key, { type: 'wrongLength', value: '', context: options })
    );
  });

  test('it accepts an `allowBlank` option', function (assert) {
    let key = 'firstName';
    let options = { allowBlank: true };
    let validator = validateLength(options);

    assert.true(validator(key, ''));
    assert.true(validator(key, 'a'));
    assert.true(validator(key, null));
    assert.true(validator(key, undefined));
  });

  test('it can output custom message string', function (assert) {
    let key = 'firstName';
    let options = { is: 2, message: '{description} should be length {is}' };
    let validator = validateLength(options);

    assert.strictEqual(
      validator(key, 'abc'),
      'First name should be length 2',
      'custom messsage string is generated correctly'
    );
  });

  test('it can output custom message function', function (assert) {
    assert.expect(5);

    let key = 'firstName';
    let options = {
      is: 2,
      message: function (_key, type, value, context) {
        assert.strictEqual(_key, key);
        assert.strictEqual(type, 'wrongLength');
        assert.strictEqual(value, 'abc');
        assert.strictEqual(context.is, 2);

        return 'some test message';
      },
    };
    let validator = validateLength(options);

    assert.strictEqual(
      validator(key, 'abc'),
      'some test message',
      'custom message function is returned correctly'
    );
  });
});
