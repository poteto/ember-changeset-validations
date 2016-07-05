import validateExclusion from 'dummy/validators/exclusion';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | exclusion');

test('it accepts a `list` option', function(assert) {
  let key = 'title';
  let options = { list: ['Manager', 'VP', 'Director'] };
  let validator = validateExclusion(options);

  assert.equal(validator(key, ''), true);
  assert.equal(validator(key, 'Executive'), true);
  assert.equal(validator(key, 'Manager'), buildMessage(key, 'exclusion', 'Manager', options));
});

test('it accepts a `range` option', function(assert) {
  let key = 'age';
  let options = { range: [18, 60] };
  let validator = validateExclusion(options);

  assert.equal(validator(key, ''), true);
  assert.equal(validator(key, 61), true);
  assert.equal(validator(key, 21), buildMessage(key, 'exclusion', 21, options));
});

test('it can output custom message string', function(assert) {
  let key = 'age';
  let options = { range: [18, 60], message: 'Your {description} is invalid, should not be within {range}' };
  let validator = validateExclusion(options);

  assert.equal(validator(key, 20), 'Your Age is invalid, should not be within 18,60', 'custom message string generated correctly');
});

test('it can output custom message function', function(assert) {
  assert.expect(4);

  let key = 'age';
  let options = {
    list: ['Test'],
    message: function(_key, type, value) {
      assert.equal(_key, key);
      assert.equal(type, 'exclusion');
      assert.equal(value, 'Test');

      return 'some test message';
    }
  };
  let validator = validateExclusion(options);

  assert.equal(validator(key, 'Test'), 'some test message', 'custom message function is returned correctly');
});
