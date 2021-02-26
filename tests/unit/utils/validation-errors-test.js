import getMessages from 'ember-changeset-validations/utils/get-messages';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';
import config from 'ember-get-config';
import { get, set } from '@ember/object';

const messages = getMessages();

module('Unit | Utility | validation errors', function() {
  test('#getDescriptionFor formats a key into a description', function(assert) {
    assert.equal(messages.getDescriptionFor('firstName'), 'First name');
    assert.equal(messages.getDescriptionFor('first name'), 'First name');
    assert.equal(messages.getDescriptionFor('first_name'), 'First name');
    assert.equal(messages.getDescriptionFor('first-name'), 'First name');
  });

  test('#formatMessage formats a blank message', function(assert) {
    assert.equal(messages.formatMessage('{foo} is {bar}', { foo: 'foo', bar: 'bar' }), 'foo is bar');
  });

  test('#buildMessage builds a validation message', function(assert) {
    assert.ok(buildMessage('firstName', { type: 'invalid' }).indexOf('First name is invalid') !== -1);
  });

  test('#buildMessage builds a custom message if custom message is string', function(assert) {
    assert.equal(
      buildMessage('firstName', { type: 'custom', value: 'testValue', context: { message: "{description} can't be equal to {foo}", foo: 'foo' }}),
      "First name can't be equal to foo",
      'Built message is generated correctly'
    );
  });

  test('#buildMessage returns correct defaults for "blank" and "present"', function(assert) {
    assert.expect(2);
    assert.equal(buildMessage('firstName', { type: 'present' }),
      'First name can\'t be blank',
      '"present" message is correct');
    assert.equal(buildMessage('firstName', { type: 'blank' }),
      'First name must be blank',
      '"blank" message is correct');
  });

  test('#buildMessage builds a custom message if custom message is a function', function(assert) {
    assert.expect(5);

    function message(key, type, value, context) {
      assert.equal(key, 'firstName');
      assert.equal(type, 'custom');
      assert.equal(value, 'testValue');
      assert.equal(context.foo, 'foo');

      return 'some test message';
    }

    assert.equal(
      buildMessage('firstName', { type: 'custom', value: 'testValue', context: { message, foo: 'foo' }}),
      'some test message',
      'correct custom error message is returned'
    );
  });

  test('#buildMessage can return a raw data structure', function(assert) {
    let originalConfig = get(config, 'changeset-validations'); // enable the feature
    set(config, 'changeset-validations', { rawOutput: true });
    let result = buildMessage('firstName', { type: 'present', value: 'testValue', context: { foo: 'foo' }})
    assert.ok(typeof result !== 'string', 'the return value is an object')
    let { message, type, value, context: { description } } = result
    assert.equal(message, "{description} can't be blank", 'default message is given')
    assert.equal(description, 'First name', 'description is returned')
    assert.equal(type, 'present', 'the type of the error is returned')
    assert.equal(value, 'testValue', 'the passed value is returned')
    set(config, 'changeset-validations', originalConfig); // reset the config
  });

  test('#buildMessage can return a raw data structure for a date', function(assert) {
    let originalConfig = get(config, 'changeset-validations'); // enable the feature
    set(config, 'changeset-validations', { rawOutput: true });
    let d = new Date();
    let result = buildMessage('firstName', { type: 'date', value: d, context: { foo: 'foo' }})
    assert.ok(typeof result !== 'string', 'the return value is an object')
    let { message, type, value, context: { description } } = result
    assert.equal(message, "[CUSTOM] {description} must be a valid date", 'default message is given')
    assert.equal(description, 'First name', 'description is returned')
    assert.equal(type, 'date', 'the type of the error is returned')
    assert.equal(value, d, 'the passed value is returned')
    set(config, 'changeset-validations', originalConfig); // reset the config
  });
});
