import validateNumber from 'ember-changeset-validations/validators/number';
import { buildMessage } from 'ember-changeset-validations/utils';
import { module, test } from 'qunit';

module('Unit | Validator | number', function () {
  test('it accepts an `allowBlank` option', function (assert) {
    let key = 'age';
    let options = { allowBlank: true };
    let validator = validateNumber(options);

    assert.true(validator(key, ''), 'empty string is allowed');
    assert.true(validator(key, null), 'null is allowed');
    assert.true(validator(key, undefined), 'undefined is allowed');
    assert.true(validator(key, '6'), 'numeric string is allowed');

    assert.strictEqual(
      validator(key, 'not a number'),
      buildMessage(key, {
        type: 'notANumber',
        value: 'not a number',
        context: options,
      }),
      'non-numeric string is not allowed'
    );
    assert.strictEqual(
      validator(key, NaN),
      buildMessage(key, { type: 'notANumber', value: NaN, context: options }),
      'NaN is not allowed'
    );
  });

  test('it rejects non-numbers', function (assert) {
    let key = 'age';
    let options = {};
    let validator = validateNumber(options);

    assert.strictEqual(
      validator(key, 'not a number'),
      buildMessage(key, {
        type: 'notANumber',
        value: 'not a number',
        context: options,
      })
    );
    assert.true(validator(key, '7'));
    assert.true(validator(key, 7));
  });

  test('it rejects empty strings', function (assert) {
    let key = 'age';
    let options = {};
    let validator = validateNumber(options);

    assert.strictEqual(
      validator(key, ''),
      buildMessage(key, { type: 'notANumber' })
    );
    assert.true(validator(key, '7'));
  });

  test('it rejects null and undefined', function (assert) {
    let key = 'age';
    let options = {};
    let validator = validateNumber(options);

    assert.strictEqual(
      validator(key, null),
      buildMessage(key, { type: 'notANumber' })
    );
    assert.strictEqual(
      validator(key, undefined),
      buildMessage(key, { type: 'notANumber' })
    );
  });

  test('it accepts an `integer` option', function (assert) {
    let key = 'age';
    let options = { integer: true };
    let validator = validateNumber(options);

    assert.strictEqual(
      validator(key, '8.5'),
      buildMessage(key, {
        type: 'notAnInteger',
        value: '8.5',
        context: options,
      })
    );
    assert.true(validator(key, '7'));
  });

  test('it accepts an `is` option', function (assert) {
    let key = 'age';
    let options = { is: 12 };
    let validator = validateNumber(options);

    assert.strictEqual(
      validator(key, '8.5'),
      buildMessage(key, { type: 'equalTo', value: '8.5', context: options })
    );
    assert.true(validator(key, '12'));
  });

  test('it accepts a `lt` option', function (assert) {
    let key = 'age';
    let options = { lt: 12 };
    let validator = validateNumber(options);

    assert.strictEqual(
      validator(key, '15'),
      buildMessage(key, { type: 'lessThan', value: '15', context: options })
    );
    assert.strictEqual(
      validator(key, '12'),
      buildMessage(key, { type: 'lessThan', value: '12', context: options })
    );
    assert.true(validator(key, '4'));
  });

  test('it accepts a `lte` option', function (assert) {
    let key = 'age';
    let options = { lte: 12 };
    let validator = validateNumber(options);

    assert.strictEqual(
      validator(key, '15'),
      buildMessage(key, {
        type: 'lessThanOrEqualTo',
        value: '15',
        context: options,
      })
    );
    assert.true(validator(key, '12'));
    assert.true(validator(key, '4'));
  });

  test('it accepts a `gt` option', function (assert) {
    let key = 'age';
    let options = { gt: 12 };
    let validator = validateNumber(options);

    assert.true(validator(key, '15'));
    assert.strictEqual(
      validator(key, '12'),
      buildMessage(key, { type: 'greaterThan', value: '12', context: options })
    );
    assert.strictEqual(
      validator(key, '4'),
      buildMessage(key, { type: 'greaterThan', value: '4', context: options })
    );
  });

  test('it accepts a `gte` option', function (assert) {
    let key = 'age';
    let options = { gte: 12 };
    let validator = validateNumber(options);

    assert.true(validator(key, '15'));
    assert.true(validator(key, '12'));
    assert.strictEqual(
      validator(key, '4'),
      buildMessage(key, {
        type: 'greaterThanOrEqualTo',
        value: '4',
        context: options,
      })
    );
  });

  test('it accepts a `positive` option', function (assert) {
    let key = 'age';
    let options = { positive: true };
    let validator = validateNumber(options);

    assert.true(validator(key, '15'));
    assert.strictEqual(
      validator(key, '-12'),
      buildMessage(key, { type: 'positive', value: '-12', context: options })
    );
  });

  test('it accepts an `odd` option', function (assert) {
    let key = 'age';
    let options = { odd: true };
    let validator = validateNumber(options);

    assert.true(validator(key, '15'));
    assert.strictEqual(
      validator(key, '34'),
      buildMessage(key, { type: 'odd', value: '34', context: options })
    );
  });

  test('it accepts an `even` option', function (assert) {
    let key = 'age';
    let options = { even: true };
    let validator = validateNumber(options);

    assert.strictEqual(
      validator(key, '15'),
      buildMessage(key, { type: 'even', value: '15', context: options })
    );
    assert.true(validator(key, '34'));
  });

  test('it accepts an `multipleOf` option', function (assert) {
    let key = 'age';
    let options = { multipleOf: 17 };
    let validator = validateNumber(options);

    assert.strictEqual(
      validator(key, '15'),
      buildMessage(key, { type: 'multipleOf', value: '15', context: options })
    );
    assert.true(validator(key, '34'));
  });

  test('it can output custom message string', function (assert) {
    let key = 'age';
    let options = { even: true, message: 'Even {description} is wrong' };
    let validator = validateNumber(options);

    assert.strictEqual(
      validator(key, 33),
      'Even Age is wrong',
      'custom message string is generated correctly'
    );
  });

  test('it can output custom message function', function (assert) {
    assert.expect(5);

    let key = 'age';
    let options = {
      even: true,
      message: function (_key, type, value, context) {
        assert.strictEqual(_key, key);
        assert.strictEqual(type, 'even');
        assert.strictEqual(value, 33);
        assert.true(context.even);

        return 'some test message';
      },
    };
    let validator = validateNumber(options);

    assert.strictEqual(
      validator(key, 33),
      'some test message',
      'custom message function is returned correctly'
    );
  });
});
