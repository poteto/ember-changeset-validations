import validateConfirmation from 'ember-changeset-validations/validators/confirmation';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | confirmation');

test('it accepts an `on` option', function(assert) {
  let changes = { password: '1234567' };
  let key = 'passwordConfirmation';
  let opts = { on: 'password' };
  let validator = validateConfirmation(opts);

  assert.equal(validator(key, undefined, undefined, changes), buildMessage(key, 'confirmation', null, opts));
  assert.equal(validator(key, null, undefined, changes), buildMessage(key, 'confirmation', null, opts));
  assert.equal(validator(key, '', undefined, changes), buildMessage(key, 'confirmation', null, opts));
  assert.equal(validator(key, '1234567', undefined, changes), true);
});

test('it can output custom message string', function(assert) {
  let changes = { password: '1234567' };
  let key = 'passwordConfirmation';
  let opts = { on: 'password', message: '{description} is not equal to {on}' };
  let validator = validateConfirmation(opts);

  assert.equal(
    validator(key, undefined, undefined, changes),
    'Password confirmation is not equal to password',
    'custom message string is generated correctly'
  );
});

test('it can output with custom message function', function(assert) {
  assert.expect(5);

  let changes = { password: '1234567' };
  let key = 'passwordConfirmation';
  let opts = {
    on: 'password',
    message: function (_key, type, value, context) {
      assert.equal(_key, key);
      assert.equal(type, 'confirmation');
      assert.equal(value, 'testValue');
      assert.equal(context.on, opts.on);

      return 'some test message';
    }
  };
  let validator = validateConfirmation(opts);

  assert.equal(
    validator(key, 'testValue', undefined, changes),
    'some test message',
    'custom message function is returned correctly'
  );
});

test('it accepts an `allowBlank` option', function(assert) {
  let key = 'email';
  let options = { allowBlank: true };
  let validator = validateConfirmation(options);

  assert.equal(validator(key, ''), true, 'Empty string is accepted');
});
