import validateInclusion from 'dummy/validators/inclusion';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | length');

test('it accepts a `list` option', function(assert) {
  let key = 'title';
  let options = { list: ['Manager', 'VP', 'Director'] };
  let validator = validateInclusion(options);

  assert.equal(validator(key, ''), buildMessage(key, 'inclusion', options));
  assert.equal(validator(key, 'Executive'), buildMessage(key, 'inclusion', options));
  assert.equal(validator(key, 'Manager'), true);
});

test('it accepts a `range` option', function(assert) {
  let key = 'age';
  let options = { range: [18, 60] };
  let validator = validateInclusion(options);

  assert.equal(validator(key, ''), buildMessage(key, 'inclusion', options));
  assert.equal(validator(key, 61), buildMessage(key, 'inclusion', options));
  assert.equal(validator(key, 21), true);
});
