import validateConfirmation from 'ember-changeset-validations/validators/confirmation';
import { buildMessage } from 'ember-changeset-validations/utils';
import { module, test } from 'qunit';

module('Unit | Validator | confirmation', function () {
  test('it accepts an `on` option', function (assert) {
    let changes = { password: '1234567' };
    let key = 'passwordConfirmation';
    let opts = { on: 'password' };
    let validator = validateConfirmation(opts);

    assert.strictEqual(
      validator(key, undefined, undefined, changes),
      buildMessage(key, { type: 'confirmation', context: opts })
    );
    assert.strictEqual(
      validator(key, null, undefined, changes),
      buildMessage(key, { type: 'confirmation', context: opts })
    );
    assert.strictEqual(
      validator(key, '', undefined, changes),
      buildMessage(key, { type: 'confirmation', context: opts })
    );
    assert.true(validator(key, '1234567', undefined, changes));
  });

  test('it can output custom message string', function (assert) {
    let changes = { password: '1234567' };
    let key = 'passwordConfirmation';
    let opts = {
      on: 'password',
      message: '{description} is not equal to {on}',
    };
    let validator = validateConfirmation(opts);

    assert.strictEqual(
      validator(key, undefined, undefined, changes),
      'Password confirmation is not equal to password',
      'custom message string is generated correctly'
    );
  });

  test('it can output with custom message function', function (assert) {
    assert.expect(5);

    let changes = { password: '1234567' };
    let key = 'passwordConfirmation';
    let opts = {
      on: 'password',
      message: function (_key, type, value, context) {
        assert.strictEqual(_key, key);
        assert.strictEqual(type, 'confirmation');
        assert.strictEqual(value, 'testValue');
        assert.strictEqual(context.on, opts.on);

        return 'some test message';
      },
    };
    let validator = validateConfirmation(opts);

    assert.strictEqual(
      validator(key, 'testValue', undefined, changes),
      'some test message',
      'custom message function is returned correctly'
    );
  });

  test('it accepts an `allowBlank` option', function (assert) {
    let key = 'email';
    let options = { allowBlank: true, on: 'foo' };
    let validator = validateConfirmation(options);

    assert.true(validator(key, ''), 'Empty string is accepted');
  });
});

test('It looks for default values as well as "changes" values', function (assert) {
  assert.expect(2);

  let password = '1234567';
  let content = { password };
  let key = 'passwordConfirmation';
  let opts = { on: 'password' };
  let validator = validateConfirmation(opts);

  assert.strictEqual(
    validator(key, 'foo', undefined, {}, content),
    buildMessage(key, { type: 'confirmation', context: opts })
  );
  assert.true(validator(key, password, undefined, {}, content));
});
