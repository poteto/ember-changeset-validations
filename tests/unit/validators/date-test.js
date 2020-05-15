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

    assert.equal(
      validator(key, '1992-03-30'),
      buildMessage(key, { type: 'date', value: 'not a date', context: options }),
      'result: [CUSTOM] Birth date must be a valid date'
    );
    assert.equal(
      validator(key, NaN),
      buildMessage(key, { type: 'date', value: NaN, context: options }),
      'result: NaN is not allowed'
    );
    assert.equal(
      validator(key, {}),
      buildMessage(key, { type: 'date', value: {}, context: options }),
      'result: empty object is not allowed'
    );
  });

  test('it accepts valid values', function(assert) {
    const key = 'test_date';
    const afterDate = new Date();
    let options = { before: afterDate };
    let validator = validateDate(options);

    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 2);
    assert.equal(validator(key, startDate), true, 'accepts Date object');

    assert.equal(validator(key, Date.parse(startDate)), true, 'accepts milliseconds');

    options = { before: Date.parse(afterDate) };
    validator = validateDate(options);
    assert.equal(validator(key, Date.parse(startDate)), true, 'accepts milliseconds with both args');
  });

  test('it accepts custom message', function(assert) {
    const key = 'test_date';
    const options = { message: 'pity a fool' };
    const validator = validateDate(options);

    // assumes current moment
    assert.equal(
      validator(key, ''),
      buildMessage(key, { type: 'date', value: 'pity a fool', context: options }),
      'result: [CUSTOM] Test date must be a valid date'
    );
  });

  test('it rejects invalid values', function(assert) {
    const key = 'test_date';
    const options = {};
    const validator = validateDate(options);

    // assumes current moment
    assert.equal(
      validator(key, ''),
      buildMessage(key, { type: 'date', value: 'not a date', context: options }),
      'result: [CUSTOM] Test date must be a valid date'
    );
    assert.equal(
      validator(key, null),
      buildMessage(key, { type: 'date', value: 'not a date', context: options }),
      'result: [CUSTOM] Test date must be a valid date'
    );
    assert.equal(
      validator(key, undefined),
      buildMessage(key, { type: 'date', value: 'not a date', context: options }),
      'result: [CUSTOM] Test date must be a valid date'
    );
    assert.equal(
      validator(key, '1992-03-30'),
      buildMessage(key, { type: 'date', value: 'not a date', context: options }),
      'result: [CUSTOM] Test date must be a valid date'
    );
    assert.equal(
      validator(key, 'not a date'),
      buildMessage(key, { type: 'date', value: 'not a date', context: options }),
      'non-date string is not allowed'
    );
    assert.equal(
      validator(key, NaN),
      buildMessage(key, { type: 'date', value: NaN, context: options }),
      'NaN is not allowed'
    );
    assert.equal(
      validator(key, {}),
      buildMessage(key, { type: 'date', value: {}, context: options }),
      'empty object is not allowed'
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
      'date is after "before" date'
    );

    options = { before: afterDate };
    validator = validateDate(options);
    assert.equal(
      validator(key, startDate),
      true,
      'date is "before" date'
    );
  });

  test('it accepts a `onOrBefore` option', function(assert) {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 2);
    const afterDate = new Date();

    const key = 'test_date';
    let options = { onOrBefore: startDate };

    let validator = validateDate(options);

    // Testing with onOrBefore date in the future
    assert.equal(
      validator(key, afterDate),
      buildMessage(key, { afterDate, message: `[ON OR BEFORE] date is NOT on or before ${afterDate}` }),
      'date is after "onOrBefore" date'
    );

    options = { onOrBefore: afterDate };
    validator = validateDate(options);
    assert.equal(
      validator(key, startDate),
      true,
      'date is "onOrBefore" date'
    );
  });

  test('it accepts a `after` option', function(assert) {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 2);
    const afterDate = new Date();

    const key = 'test_date';
    let options = { after: afterDate };

    let validator = validateDate(options);

    // Testing with after date in the future
    assert.equal(
      validator(key, startDate),
      buildMessage(key, { startDate, message: `[AFTER] date is NOT after ${startDate}` }),
      'date is after the "after" date'
    );

    options = { after: startDate };
    validator = validateDate(options);
    assert.equal(
      validator(key, afterDate),
      true,
      'date is "after" date'
    );
  });

  test('it accepts a `onOrAfter` option', function(assert) {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 2);
    const onOrAfterDate = new Date();

    const key = 'test_date';
    let options = { onOrAfter: onOrAfterDate };

    let validator = validateDate(options);

    // Testing with onOrAfter date in the future
    assert.equal(
      validator(key, startDate),
      buildMessage(key, { onOrAfterDate, message: `[ON OR AFTER] date is NOT on or after ${startDate}` }),
      'date onOrAfter the "onOrAfter" date is not allowed'
    );

    options = { onOrAfter: startDate };
    validator = validateDate(options);
    assert.equal(
      validator(key, onOrAfterDate),
      true,
      'date is "onOrAfter" date'
    );
  });
});
