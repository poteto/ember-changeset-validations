import validateExclusion from 'ember-changeset-validations/validators/exclusion';
import { buildMessage } from 'ember-changeset-validations/utils';
import { module, test } from 'qunit';

module('Unit | Validator | exclusion', function () {
  test('it accepts a `list` option', function (assert) {
    let key = 'title';
    let options = { list: ['Manager', 'VP', 'Director'] };
    let validator = validateExclusion(options);

    assert.true(validator(key, ''));
    assert.true(validator(key, 'Executive'));
    assert.strictEqual(
      validator(key, 'Manager'),
      buildMessage(key, {
        type: 'exclusion',
        value: 'Manager',
        context: options,
      })
    );
  });

  test('it accepts a `range` option', function (assert) {
    let key = 'age';
    let options = { range: [18, 60] };
    let validator = validateExclusion(options);

    assert.true(validator(key, ''));
    assert.true(validator(key, 61));
    assert.strictEqual(
      validator(key, 21),
      buildMessage(key, { type: 'exclusion', value: 21, context: options })
    );
  });

  test('it can output custom message string', function (assert) {
    let key = 'age';
    let options = {
      range: [18, 60],
      message: 'Your {description} is invalid, should not be within {range}',
    };
    let validator = validateExclusion(options);

    assert.strictEqual(
      validator(key, 20),
      'Your Age is invalid, should not be within 18,60',
      'custom message string generated correctly'
    );
  });

  test('it can output custom message function', function (assert) {
    assert.expect(4);

    let key = 'age';
    let options = {
      list: ['Test'],
      message: function (_key, type, value) {
        assert.strictEqual(_key, key);
        assert.strictEqual(type, 'exclusion');
        assert.strictEqual(value, 'Test');

        return 'some test message';
      },
    };
    let validator = validateExclusion(options);

    assert.strictEqual(
      validator(key, 'Test'),
      'some test message',
      'custom message function is returned correctly'
    );
  });

  test('it accepts an `allowBlank` option', function (assert) {
    let key = 'email';
    let options = { allowBlank: true };
    let validator = validateExclusion(options);

    assert.true(validator(key, ''), 'Empty string is accepted');
  });
});
