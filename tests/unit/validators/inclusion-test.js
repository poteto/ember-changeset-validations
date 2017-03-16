import validateInclusion from 'ember-changeset-validations/validators/inclusion';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | inclusion');

test('it accepts a `list` option', function(assert) {
  let key = 'title';
  let options = { list: ['Manager', 'VP', 'Director'] };
  let validator = validateInclusion(options);

  assert.equal(validator(key, ''), buildMessage(key, { type: 'inclusion', value: '', context: options }));
  assert.equal(validator(key, 'Executive'), buildMessage(key, { type: 'inclusion', value: 'Executive', context: options }));
  assert.equal(validator(key, 'Manager'), true);
});

test('it accepts a `range` option', function(assert) {
  let key = 'age';
  let options = { range: [18, 60] };
  let validator = validateInclusion(options);

  assert.equal(validator(key, ''), buildMessage(key, { type: 'inclusion', value: '', context: options }));
  assert.equal(validator(key, 61), buildMessage(key, { type: 'inclusion', value: 61, context: options }));
  assert.equal(validator(key, 21), true);
});

test('it can output custom message string', function(assert) {
  let key = 'age';
  let options = { range: [18, 60], message: 'Your {description} is invalid, should be within {range}' };
  let validator = validateInclusion(options);

  assert.equal(validator(key, 92), 'Your Age is invalid, should be within 18,60', 'custom message string is generated correctly');
});

test('it can output custom message function', function(assert) {
  assert.expect(4);

  let key = 'age';
  let options = {
    list: ['Something'],
    message: function(_key, type, value) {
      assert.equal(_key, key);
      assert.equal(type, 'inclusion');
      assert.equal(value, 'Test');

      return 'some test message';
    }
  };
  let validator = validateInclusion(options);

  assert.equal(validator(key, 'Test'), 'some test message', 'custom message function is returned correctly');
});

test('it accepts an `allowBlank` option', function(assert) {
  let key = 'email';
  let options = { allowBlank: true };
  let validator = validateInclusion(options);

  assert.equal(validator(key, ''), true, 'Empty string is accepted');
});
