import {
  default as buildMessage,
  formatDescription,
  formatMessage
} from 'dummy/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Utility | validation errors');

test('#formatDescription formats a key into a description', function(assert) {
  assert.equal(formatDescription('firstName'), 'First name');
  assert.equal(formatDescription('first name'), 'First name');
  assert.equal(formatDescription('first_name'), 'First name');
  assert.equal(formatDescription('first-name'), 'First name');
});

test('#formatMessage formats a blank message', function(assert) {
  assert.equal(formatMessage('{foo} is {bar}', { foo: 'foo', bar: 'bar' }), 'foo is bar');
});

test('#buildMessage builds a validation message', function(assert) {
  assert.equal(buildMessage('firstName', 'invalid'), 'First name is invalid');
});
