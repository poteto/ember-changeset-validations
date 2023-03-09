import validateInclusion from 'ember-changeset-validations/validators/inclusion';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | inclusion', function () {
  test('it accepts a `list` option', function (assert) {
    let key = 'title';
    let options = { list: ['Manager', 'VP', 'Director'] };
    let validator = validateInclusion(options);

    assert.strictEqual(
      validator(key, ''),
      buildMessage(key, { type: 'inclusion', value: '', context: options })
    );
    assert.strictEqual(
      validator(key, 'Executive'),
      buildMessage(key, {
        type: 'inclusion',
        value: 'Executive',
        context: options,
      })
    );
    assert.true(validator(key, 'Manager'));
  });

  test('it accepts a `range` option', function (assert) {
    let key = 'age';
    let options = { range: [18, 60] };
    let validator = validateInclusion(options);

    assert.strictEqual(
      validator(key, ''),
      buildMessage(key, { type: 'inclusion', value: '', context: options })
    );
    assert.strictEqual(
      validator(key, 61),
      buildMessage(key, { type: 'inclusion', value: 61, context: options })
    );
    assert.true(validator(key, 21));
  });

  test('it can output custom message string', function (assert) {
    let key = 'age';
    let options = {
      range: [18, 60],
      message: 'Your {description} is invalid, should be within {range}',
    };
    let validator = validateInclusion(options);

    assert.strictEqual(
      validator(key, 92),
      'Your Age is invalid, should be within 18,60',
      'custom message string is generated correctly'
    );
  });

  test('it can output custom message function', function (assert) {
    assert.expect(4);

    let key = 'age';
    let options = {
      list: ['Something'],
      message: function (_key, type, value) {
        assert.strictEqual(_key, key);
        assert.strictEqual(type, 'inclusion');
        assert.strictEqual(value, 'Test');

        return 'some test message';
      },
    };
    let validator = validateInclusion(options);

    assert.strictEqual(
      validator(key, 'Test'),
      'some test message',
      'custom message function is returned correctly'
    );
  });

  test('it accepts an `allowBlank` option', function (assert) {
    let key = 'email';
    let options = { allowBlank: true };
    let validator = validateInclusion(options);

    assert.true(validator(key, null), 'null is accepted');
    assert.true(validator(key, undefined), 'undefined is accepted');
    assert.true(validator(key, ''), 'empty string is accepted');
  });
});
