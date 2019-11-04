import validateNumber from 'ember-changeset-validations/validators/number';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | number', function() {
  test('it accepts an `allowBlank` option', function(assert) {
    let key = 'age';
    let options = { allowBlank: true };
    let validator = validateNumber(options);

    assert.equal(validator(key, ''), true, 'empty string is allowed');
    assert.equal(validator(key, null), true, 'null is allowed');
    assert.equal(validator(key, undefined), true, 'undefined is allowed');
    assert.equal(validator(key, '6'), true, 'numeric string is allowed');

    assert.equal(validator(key, 'not a number'), buildMessage(key, { type: 'notANumber', value: 'not a number', context: options }),
      'non-numeric string is not allowed');
    assert.equal(validator(key, NaN), buildMessage(key, { type: 'notANumber', value: NaN, context: options }),
      'NaN is not allowed');
  });

  test('it rejects non-numbers', function(assert) {
    let key = 'age';
    let options = {};
    let validator = validateNumber(options);

    assert.equal(validator(key, 'not a number'), buildMessage(key, { type: 'notANumber', value: 'not a number', context: options }));
    assert.equal(validator(key, '7'), true);
    assert.equal(validator(key, 7), true);
  });

  test('it rejects empty strings', function(assert) {
    let key = 'age';
    let options = {};
    let validator = validateNumber(options);

    assert.equal(validator(key, ''), buildMessage(key, { type: 'notANumber' }));
    assert.equal(validator(key, '7'), true);
  });

  test('it rejects null and undefined', function(assert) {
    let key = 'age';
    let options = {};
    let validator = validateNumber(options);

    assert.equal(validator(key, null), buildMessage(key, { type: 'notANumber' }));
    assert.equal(validator(key, undefined), buildMessage(key, { type: 'notANumber' }));
  });

  test('it accepts an `integer` option', function(assert) {
    let key = 'age';
    let options = { integer: true };
    let validator = validateNumber(options);

    assert.equal(validator(key, '8.5'), buildMessage(key, { type: 'notAnInteger', value: '8.5', context: options }));
    assert.equal(validator(key, '7'), true);
  });

  test('it accepts an `is` option', function(assert) {
    let key = 'age';
    let options = { is: 12 };
    let validator = validateNumber(options);

    assert.equal(validator(key, '8.5'), buildMessage(key, { type: 'equalTo', value: '8.5', context: options }));
    assert.equal(validator(key, '12'), true);
  });

  test('it accepts a `lt` option', function(assert) {
    let key = 'age';
    let options = { lt: 12 };
    let validator = validateNumber(options);

    assert.equal(validator(key, '15'), buildMessage(key, { type: 'lessThan', value: '15', context: options }));
    assert.equal(validator(key, '12'), buildMessage(key, { type: 'lessThan', value: '12', context: options }));
    assert.equal(validator(key, '4'), true);
  });

  test('it accepts a `lte` option', function(assert) {
    let key = 'age';
    let options = { lte: 12 };
    let validator = validateNumber(options);

    assert.equal(validator(key, '15'), buildMessage(key, { type: 'lessThanOrEqualTo', value: '15', context: options }));
    assert.equal(validator(key, '12'), true);
    assert.equal(validator(key, '4'), true);
  });

  test('it accepts a `gt` option', function(assert) {
    let key = 'age';
    let options = { gt: 12 };
    let validator = validateNumber(options);

    assert.equal(validator(key, '15'), true);
    assert.equal(validator(key, '12'), buildMessage(key, { type: 'greaterThan', value: '12', context: options }));
    assert.equal(validator(key, '4'), buildMessage(key, { type: 'greaterThan', value: '4', context: options }));
  });

  test('it accepts a `gte` option', function(assert) {
    let key = 'age';
    let options = { gte: 12 };
    let validator = validateNumber(options);

    assert.equal(validator(key, '15'), true);
    assert.equal(validator(key, '12'), true);
    assert.equal(validator(key, '4'), buildMessage(key, { type: 'greaterThanOrEqualTo', value: '4', context: options }));
  });

  test('it accepts a `positive` option', function(assert) {
    let key = 'age';
    let options = { positive: true };
    let validator = validateNumber(options);

    assert.equal(validator(key, '15'), true);
    assert.equal(validator(key, '-12'), buildMessage(key, { type: 'positive', value: '-12', context: options }));
  });

  test('it accepts an `odd` option', function(assert) {
    let key = 'age';
    let options = { odd: true };
    let validator = validateNumber(options);

    assert.equal(validator(key, '15'), true);
    assert.equal(validator(key, '34'), buildMessage(key, { type: 'odd', value: '34', context: options }));
  });

  test('it accepts an `even` option', function(assert) {
    let key = 'age';
    let options = { even: true };
    let validator = validateNumber(options);

    assert.equal(validator(key, '15'), buildMessage(key, { type: 'even', value: '15', context: options }));
    assert.equal(validator(key, '34'), true);
  });

  test('it accepts an `multipleOf` option', function(assert) {
    let key = 'age';
    let options = { multipleOf: 17 };
    let validator = validateNumber(options);

    assert.equal(validator(key, '15'), buildMessage(key, { type: 'multipleOf', value: '15', context: options }));
    assert.equal(validator(key, '34'), true);
  });

  test('it can output custom message string', function(assert) {
    let key = 'age';
    let options = { even: true, message: 'Even {description} is wrong' };
    let validator = validateNumber(options);

    assert.equal(validator(key, 33), 'Even Age is wrong', 'custom message string is generated correctly');
  });

  test('it can output custom message function', function(assert) {
    assert.expect(5);

    let key = 'age';
    let options = {
      even: true,
      message: function(_key, type, value, context) {
        assert.equal(_key, key);
        assert.equal(type, 'even');
        assert.equal(value, 33);
        assert.strictEqual(context.even, true);

        return 'some test message';
      }
    };
    let validator = validateNumber(options);

    assert.equal(validator(key, 33), 'some test message', 'custom message function is returned correctly');
  });
});
