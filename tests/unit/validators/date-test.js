import validateDate from 'ember-changeset-validations/validators/date';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | date', function() {
  test('it accepts an `allowBlank` option', function(assert) {
    let key = 'birth_date';
    let options = { allowBlank: true };
    let validator = validateDate(options);

    assert.equal(validator(key, null), true, 'null is allowed');
    assert.equal(validator(key, undefined), true, 'undefined is allowed');
    assert.equal(validator(key, 123), true, 'number value is is allowed');

    assert.equal(validator(key, '1992-03-30'),
      buildMessage(key, { type: 'date', value: 'not a date', context: options }), '[CUSTOM] Birth date must be a valid date'
    );
    assert.equal(validator(key, NaN),
      buildMessage(key, { type: 'date', value: NaN, context: options }), 'NaN is not allowed'
    );
    assert.equal(validator(key, {}),
      buildMessage(key, { type: 'date', value: {}, context: options }), 'empty object is not allowed'
    );
  });

  test('it accepts valid values', function(assert) {
    const key = 'test_date';
    const options = {};
    const validator = validateDate(options);

    // assumes current moment
    assert.equal(validator(key, ''),
      buildMessage(key, { type: 'date', value: 'not a date', context: options }), '[CUSTOM] Test date must be a valid date'
    );
    assert.equal(validator(key, null),
      buildMessage(key, { type: 'date', value: 'not a date', context: options }), '[CUSTOM] Test date must be a valid date'
    );
    assert.equal(validator(key, undefined),
      buildMessage(key, { type: 'date', value: 'not a date', context: options }), '[CUSTOM] Test date must be a valid date'
    );
    assert.equal(validator(key, '1992-03-30'),
      buildMessage(key, { type: 'date', value: 'not a date', context: options }), '[CUSTOM] Test date must be a valid date'
    );
  });

  test('it rejectes invalid values', function(assert) {
    const key = 'test_date';
    const options = {};
    const validator = validateDate(options);

    assert.equal(validator(key, 'not a date'),
      buildMessage(key, { type: 'date', value: 'not a date', context: options }), 'non-date string is not allowed'
    );
    assert.equal(validator(key, NaN),
      buildMessage(key, { type: 'date', value: NaN, context: options }), 'NaN is not allowed'
    );
    assert.equal(validator(key, {}),
      buildMessage(key, { type: 'date', value: {}, context: options }), 'empty object is not allowed'
    );
  });

  test('it accepts a `before` option', function(assert) {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 2);
    const afterDate = new Date();

    const key = 'test_date';
    let options = { before: startDate };

    let validator = validateDate(options);

    // Testing with before date in the future
    assert.equal(
      validator(key, afterDate),
      buildMessage(key, { afterDate, message: `[BEFORE] date is NOT before ${afterDate}` }),
      'date after the "before" date is not allowed'
    );

    options = { before: afterDate };
    validator = validateDate(options);
    assert.equal(
      validator(key, startDate),
      true,
      'date is "before" date'
    );
  });
});
