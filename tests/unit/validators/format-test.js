import validateFormat from 'ember-changeset-validations/validators/format';
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

  assert.equal(validator(key, 'http://lauren.com'), true);
  assert.equal(validator(key, 'somevalue'), buildMessage(key, { type: options.type }));
});

test('it accepts a `regex` option', function(assert) {
  let key = 'secret';
  let options = { regex: /^secretword$/ };
  let validator = validateFormat(options);

  assert.equal(validator(key, 'secretword'), true);
  assert.equal(validator(key, 'fail'), buildMessage(key, { type: 'invalid' }));
});

test('it accepts an `inverse` option with defined regex', function(assert) {
  let key = 'email';
  let options = { type: 'email', inverse: true };
  let validator = validateFormat(options);

  assert.equal(validator(key, 'test@example.com'), buildMessage(key, { type: 'email' }), 'email fails format test');
  assert.equal(validator(key, 'notanemail'), true, 'non-email passes format test');
});

test('it accepts an `inverse` option with custom regex', function(assert) {
  let key = 'custom';
  let options = { regex: /^customregex$/, inverse: true };
  let validator = validateFormat(options);

  assert.equal(validator(key, 'customregex'), buildMessage(key, { type: 'invalid' }), 'matching regex fails format test');
  assert.equal(validator(key, 'notmatching'), true, 'non-matching regex passes format test');
});

test('it can output custom message string', function(assert) {
  let key = 'URL';
  let options = { type: 'url', message: '{description} should be of type {type}' };
  let validator = validateFormat(options);

  assert.equal(validator(key, 'notaurl'), 'Url should be of type url', 'custom message string is generated correctly');
});

test('it can output custom message function', function(assert) {
  assert.expect(5);

  let key = 'URL';
  let options = {
    type: 'url',
    message: function(key, type, value, context) {
      assert.equal(key, 'URL');
      assert.equal(type, 'url');
      assert.equal(value, 'notaurl');
      assert.equal(context.type, 'url');

      return 'some test message';
    }
  };
  let validator = validateFormat(options);

  assert.equal(validator(key, 'notaurl'), 'some test message', 'custom message function is returned correctly');
});
