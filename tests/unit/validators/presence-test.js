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
