import validateFormat from 'dummy/validators/format';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | format');

test('it accepts an empty options', function(assert) {
  let key = 'email';
  let options = {};
  let validator = validateFormat(options);

  assert.equal(validator(key, ''), true);
});

test('it accepts an `allowBlank` option', function(assert) {
  let key = 'email';
  let options = { allowBlank: true };
  let validator = validateFormat(options);

  assert.equal(validator(key, ''), true);
});

test('it accepts a `type` option', function(assert) {
  let key = 'URL';
  let options = { type: 'url' };
  let validator = validateFormat(options);

  assert.equal(validator(key, 'http://dockyard.com'), true);
  assert.equal(validator(key, 'somevalue'), buildMessage(key, options.type));
});

test('it accepts a `regex` option', function(assert) {
  let key = 'secret';
  let options = { regex: /^secretword$/ };
  let validator = validateFormat(options);

  assert.equal(validator(key, 'secretword'), true);
  assert.equal(validator(key, 'fail'), buildMessage(key, 'invalid'));
});
