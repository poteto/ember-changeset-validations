import validateExclusion from 'dummy/validators/exclusion';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | length');

test('it accepts a `list` option', function(assert) {
  let key = 'title';
  let options = { list: ['Manager', 'VP', 'Director'] };
  let validator = validateExclusion(options);

  assert.equal(validator(key, ''), true);
  assert.equal(validator(key, 'Executive'), true);
  assert.equal(validator(key, 'Manager'), buildMessage(key, 'exclusion', options));
});

test('it accepts a `range` option', function(assert) {
  let key = 'age';
  let options = { range: [18, 60] };
  let validator = validateExclusion(options);

  assert.equal(validator(key, ''), true);
  assert.equal(validator(key, 61), true);
  assert.equal(validator(key, 21), buildMessage(key, 'exclusion', options));
});
