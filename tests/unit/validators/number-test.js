import validateNumber from 'dummy/validators/number';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | number');

test('it accepts an `allowBlank` option', function(assert) {
  let key = 'age';
  let options = { allowBlank: true };
  let validator = validateNumber(options);

  assert.equal(validator(key, ''), true);
  assert.equal(validator(key, '6'), true);
});

test('it rejects non-numbers', function(assert) {
  let key = 'age';
  let options = {};
  let validator = validateNumber(options);

  assert.equal(validator(key, 'not a number'), buildMessage(key, 'notANumber', options));
  assert.equal(validator(key, '7'), true);
});

test('it rejects empty strings', function(assert) {
  let key = 'age';
  let options = {};
  let validator = validateNumber(options);

  assert.equal(validator(key, ''), buildMessage(key, 'notANumber'));
  assert.equal(validator(key, '7'), true);
});

test('it accepts an `integer` option', function(assert) {
  let key = 'age';
  let options = { integer: true };
  let validator = validateNumber(options);

  assert.equal(validator(key, '8.5'), buildMessage(key, 'notAnInteger', options));
  assert.equal(validator(key, '7'), true);
});

test('it accepts an `is` option', function(assert) {
  let key = 'age';
  let options = { is: 12 };
  let validator = validateNumber(options);

  assert.equal(validator(key, '8.5'), buildMessage(key, 'equalTo', options));
  assert.equal(validator(key, '12'), true);
});

test('it accepts a `lt` option', function(assert) {
  let key = 'age';
  let options = { lt: 12 };
  let validator = validateNumber(options);

  assert.equal(validator(key, '15'), buildMessage(key, 'lessThan', options));
  assert.equal(validator(key, '12'), buildMessage(key, 'lessThan', options));
  assert.equal(validator(key, '4'), true);
});

test('it accepts a `lte` option', function(assert) {
  let key = 'age';
  let options = { lte: 12 };
  let validator = validateNumber(options);

  assert.equal(validator(key, '15'), buildMessage(key, 'lessThanOrEqualTo', options));
  assert.equal(validator(key, '12'), true);
  assert.equal(validator(key, '4'), true);
});

test('it accepts a `gt` option', function(assert) {
  let key = 'age';
  let options = { gt: 12 };
  let validator = validateNumber(options);

  assert.equal(validator(key, '15'), true);
  assert.equal(validator(key, '12'), buildMessage(key, 'greaterThan', options));
  assert.equal(validator(key, '4'), buildMessage(key, 'greaterThan', options));
});

test('it accepts a `gte` option', function(assert) {
  let key = 'age';
  let options = { gte: 12 };
  let validator = validateNumber(options);

  assert.equal(validator(key, '15'), true);
  assert.equal(validator(key, '12'), true);
  assert.equal(validator(key, '4'), buildMessage(key, 'greaterThanOrEqualTo', options));
});

test('it accepts a `positive` option', function(assert) {
  let key = 'age';
  let options = { positive: true };
  let validator = validateNumber(options);

  assert.equal(validator(key, '15'), true);
  assert.equal(validator(key, '-12'), buildMessage(key, 'positive', options));
});

test('it accepts an `odd` option', function(assert) {
  let key = 'age';
  let options = { odd: true };
  let validator = validateNumber(options);

  assert.equal(validator(key, '15'), true);
  assert.equal(validator(key, '34'), buildMessage(key, 'odd', options));
});

test('it accepts an `even` option', function(assert) {
  let key = 'age';
  let options = { even: true };
  let validator = validateNumber(options);

  assert.equal(validator(key, '15'), buildMessage(key, 'even', options));
  assert.equal(validator(key, '34'), true);
});
