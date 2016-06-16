import validateConfirmation from 'dummy/validators/confirmation';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | confirmation');

test('it accepts an `on` option', function(assert) {
  let changes = { password: '1234567' };
  let key = 'passwordConfirmation';
  let opts = { on: 'password' };
  let validator = validateConfirmation(opts);

  assert.equal(validator(key, undefined, undefined, changes), buildMessage(key, 'confirmation', opts));
  assert.equal(validator(key, null, undefined, changes), buildMessage(key, 'confirmation', opts));
  assert.equal(validator(key, '', undefined, changes), buildMessage(key, 'confirmation', opts));
  assert.equal(validator(key, '1234567', undefined, changes), true);
});
