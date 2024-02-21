import getMessages from 'ember-changeset-validations/utils/get-messages';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';
import config from 'ember-get-config';

const messages = getMessages();

module('Unit | Utility | validation errors', function () {
  test('#getDescriptionFor formats a key into a description', function (assert) {
    assert.strictEqual(messages.getDescriptionFor('firstName'), 'First name');
    assert.strictEqual(messages.getDescriptionFor('first name'), 'First name');
    assert.strictEqual(messages.getDescriptionFor('first_name'), 'First name');
    assert.strictEqual(messages.getDescriptionFor('first-name'), 'First name');
  });

  test('#formatMessage formats a blank message', function (assert) {
    assert.strictEqual(
      messages.formatMessage('{foo} is {bar}', { foo: 'foo', bar: 'bar' }),
      'foo is bar'
    );
  });

  test('#buildMessage builds a validation message', function (assert) {
    assert.notStrictEqual(
      buildMessage('firstName', { type: 'invalid' }).indexOf(
        'First name is invalid'
      ),
      -1
    );
  });

  test('#buildMessage builds a custom message if custom message is string', function (assert) {
    assert.strictEqual(
      buildMessage('firstName', {
        type: 'custom',
        value: 'testValue',
        context: {
          message: "{description} can't be equal to {foo}",
          foo: 'foo',
        },
      }),
      "First name can't be equal to foo",
      'Built message is generated correctly'
    );
  });

  test('#buildMessage returns correct defaults for "blank" and "present"', function (assert) {
    assert.expect(2);
    assert.strictEqual(
      buildMessage('firstName', { type: 'present' }),
      "First name can't be blank",
      '"present" message is correct'
    );
    assert.strictEqual(
      buildMessage('firstName', { type: 'blank' }),
      'First name must be blank',
      '"blank" message is correct'
    );
  });

  test('#buildMessage builds a custom message if custom message is a function', function (assert) {
    assert.expect(5);

    function message(key, type, value, context) {
      assert.strictEqual(key, 'firstName');
      assert.strictEqual(type, 'custom');
      assert.strictEqual(value, 'testValue');
      assert.strictEqual(context.foo, 'foo');

      return 'some test message';
    }

    assert.strictEqual(
      buildMessage('firstName', {
        type: 'custom',
        value: 'testValue',
        context: { message, foo: 'foo' },
      }),
      'some test message',
      'correct custom error message is returned'
    );
  });

  test('#buildMessage can return a raw data structure', function (assert) {
    let originalConfig = config['changeset-validations']; // enable the feature
    config['changeset-validations'] = { rawOutput: true };
    let result = buildMessage('firstName', {
      type: 'present',
      value: 'testValue',
      context: { foo: 'foo' },
    });
    assert.notStrictEqual(
      typeof result,
      'string',
      'the return value is an object'
    );
    let {
      message,
      type,
      value,
      context: { description },
    } = result;
    assert.ok(message, "{description} can't be blank");
    assert.strictEqual(description, 'First name', 'description is returned');
    assert.strictEqual(type, 'present', 'the type of the error is returned');
    assert.strictEqual(value, 'testValue', 'the passed value is returned');
    config['changeset-validations'] = originalConfig; // reset the config
  });

  test('#buildMessage can return a raw data structure for a date', function (assert) {
    let originalConfig = config['changeset-validations']; // enable the feature
    config['changeset-validations'] = { rawOutput: true };
    let d = new Date();
    let result = buildMessage('firstName', {
      type: 'date',
      value: d,
      context: { foo: 'foo' },
    });
    assert.notStrictEqual(
      typeof result,
      'string',
      'the return value is an object'
    );
    let {
      message,
      type,
      value,
      context: { description },
    } = result;
    assert.ok(message, '[CUSTOM] {description} must be a valid date');
    assert.strictEqual(description, 'First name', 'description is returned');
    assert.strictEqual(type, 'date', 'the type of the error is returned');
    assert.strictEqual(value, d, 'the passed value is returned');
    config['changeset-validations'] = originalConfig; // reset the config
  });

  test('#buildMessage can return a provided description in raw data structure', function (assert) {
    let originalConfig = config['changeset-validations']; // enable the feature
    config['changeset-validations'] = { rawOutput: true };
    let result = buildMessage('firstName', {
      type: 'present',
      value: 'testValue',
      context: { foo: 'foo', description: 'Name' },
    });
    assert.notStrictEqual(
      typeof result,
      'string',
      'the return value is an object'
    );
    let {
      message,
      type,
      value,
      context: { description },
    } = result;
    assert.ok(message, "{description} can't be blank");
    assert.strictEqual(description, 'Name', 'description is returned');
    assert.strictEqual(type, 'present', 'the type of the error is returned');
    assert.strictEqual(value, 'testValue', 'the passed value is returned');
    config['changeset-validations'] = originalConfig; // reset the config
  });
});
