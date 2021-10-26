import validateDate from 'ember-changeset-validations/validators/date';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | date', function () {
  test('it accepts an `allowBlank` option', function (assert) {
    let key = 'birth_date';
    let options = { allowBlank: true };
    let validator = validateDate(options);

    assert.true(validator(key, null), 'null is allowed');
    assert.true(validator(key, undefined), 'undefined is allowed');
    assert.true(validator(key, 123), 'number value is is allowed');

    assert.strictEqual(
      validator(key, '1992-03-30'),
      buildMessage(key, {
        type: 'date',
        value: 'not a date',
        context: options,
      }),
      'result: [CUSTOM] Birth date must be a valid date'
    );
    assert.strictEqual(
      validator(key, NaN),
      buildMessage(key, { type: 'date', value: NaN, context: options }),
      'result: NaN is not allowed'
    );
    assert.strictEqual(
      validator(key, {}),
      buildMessage(key, { type: 'date', value: {}, context: options }),
      'result: empty object is not allowed'
    );
  });

  test('it accepts valid values', function (assert) {
    const key = 'test_date';
    const afterDate = new Date();
    let options = { before: afterDate };
    let validator = validateDate(options);

    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 2);
    assert.true(validator(key, startDate), 'accepts Date object');

    assert.true(validator(key, Date.parse(startDate)), 'accepts milliseconds');

    options = { before: Date.parse(afterDate) };
    validator = validateDate(options);
    assert.true(
      validator(key, Date.parse(startDate)),
      'accepts milliseconds with both args'
    );
  });

  test('it accepts custom message', function (assert) {
    const key = 'test_date';
    const options = { message: 'pity a fool' };
    const validator = validateDate(options);

    // assumes current moment
    assert.strictEqual(
      validator(key, ''),
      buildMessage(key, {
        type: 'date',
        value: 'pity a fool',
        context: options,
      }),
      'result: [CUSTOM] Test date must be a valid date'
    );
  });

  test('it rejects invalid values', function (assert) {
    const key = 'test_date';
    const options = {};
    const validator = validateDate(options);

    // assumes current moment
    assert.strictEqual(
      validator(key, ''),
      buildMessage(key, {
        type: 'date',
        value: 'not a date',
        context: options,
      }),
      'result: [CUSTOM] Test date must be a valid date'
    );
    assert.strictEqual(
      validator(key, null),
      buildMessage(key, {
        type: 'date',
        value: 'not a date',
        context: options,
      }),
      'result: [CUSTOM] Test date must be a valid date'
    );
    assert.strictEqual(
      validator(key, undefined),
      buildMessage(key, {
        type: 'date',
        value: 'not a date',
        context: options,
      }),
      'result: [CUSTOM] Test date must be a valid date'
    );
    assert.strictEqual(
      validator(key, '1992-03-30'),
      buildMessage(key, {
        type: 'date',
        value: 'not a date',
        context: options,
      }),
      'result: [CUSTOM] Test date must be a valid date'
    );
    assert.strictEqual(
      validator(key, 'not a date'),
      buildMessage(key, {
        type: 'date',
        value: 'not a date',
        context: options,
      }),
      'non-date string is not allowed'
    );
    assert.strictEqual(
      validator(key, NaN),
      buildMessage(key, { type: 'date', value: NaN, context: options }),
      'NaN is not allowed'
    );
    assert.strictEqual(
      validator(key, {}),
      buildMessage(key, { type: 'date', value: {}, context: options }),
      'empty object is not allowed'
    );
  });

  test('it accepts a `before` option', function (assert) {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 2);
    const afterDate = new Date();

    const key = 'test_date';
    let options = { before: startDate };

    let validator = validateDate(options);

    // Testing with before date in the future
    assert.strictEqual(
      validator(key, afterDate),
      buildMessage(key, {
        afterDate,
        message: `[BEFORE] date is NOT before ${afterDate}`,
      }),
      'date is after "before" date'
    );

    options = { before: () => startDate };
    validator = validateDate(options);
    assert.strictEqual(
      validator(key, afterDate),
      buildMessage(key, {
        afterDate,
        message: `[BEFORE] date is NOT before ${afterDate}`,
      }),
      'before accepts a function that returns a date'
    );

    options = { before: afterDate };
    validator = validateDate(options);
    assert.true(validator(key, startDate), 'date is "before" date');
  });

  test('it accepts a `onOrBefore` option', function (assert) {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 2);
    const afterDate = new Date();

    const key = 'test_date';
    let options = { onOrBefore: startDate };

    let validator = validateDate(options);

    // Testing with onOrBefore date in the future
    assert.strictEqual(
      validator(key, afterDate),
      buildMessage(key, {
        afterDate,
        message: `[ON OR BEFORE] date is NOT on or before ${afterDate}`,
      }),
      'date is after "onOrBefore" date'
    );

    options = { onOrBefore: () => startDate };
    validator = validateDate(options);
    assert.strictEqual(
      validator(key, afterDate),
      buildMessage(key, {
        afterDate,
        message: `[ON OR BEFORE] date is NOT on or before ${afterDate}`,
      }),
      'onOrBefore accepts a function that returns a date'
    );

    options = { onOrBefore: afterDate };
    validator = validateDate(options);
    assert.true(validator(key, startDate), 'date is "onOrBefore" date');
  });

  test('it accepts a `after` option', function (assert) {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 2);
    const afterDate = new Date();

    const key = 'test_date';
    let options = { after: afterDate };

    let validator = validateDate(options);

    // Testing with after date in the future
    assert.strictEqual(
      validator(key, startDate),
      buildMessage(key, {
        startDate,
        message: `[AFTER] date is NOT after ${startDate}`,
      }),
      'date is after the "after" date'
    );

    options = { after: () => afterDate };
    validator = validateDate(options);
    assert.strictEqual(
      validator(key, startDate),
      buildMessage(key, {
        startDate,
        message: `[AFTER] date is NOT after ${startDate}`,
      }),
      'after accepts a function that returns a date'
    );

    options = { after: startDate };
    validator = validateDate(options);
    assert.true(validator(key, afterDate), 'date is "after" date');
  });

  test('it accepts a `onOrAfter` option', function (assert) {
    const startDate = new Date();
    startDate.setHours(startDate.getHours() - 2);
    const onOrAfterDate = new Date();

    const key = 'test_date';
    let options = { onOrAfter: onOrAfterDate };

    let validator = validateDate(options);

    // Testing with onOrAfter date in the future
    assert.strictEqual(
      validator(key, startDate),
      buildMessage(key, {
        onOrAfterDate,
        message: `[ON OR AFTER] date is NOT on or after ${startDate}`,
      }),
      'date onOrAfter the "onOrAfter" date is not allowed'
    );

    options = { onOrAfter: () => onOrAfterDate };
    validator = validateDate(options);
    assert.strictEqual(
      validator(key, startDate),
      buildMessage(key, {
        onOrAfterDate,
        message: `[ON OR AFTER] date is NOT on or after ${startDate}`,
      }),
      'onOrAfter accepts a function that returns a date'
    );

    options = { onOrAfter: startDate };
    validator = validateDate(options);
    assert.true(validator(key, onOrAfterDate), 'date is "onOrAfter" date');
  });

  module('with custom message handler', function () {
    const getCustomMessageHandler = () => (key, type) => {
      return `custom message: ${type}`;
    };

    test('it accepts a `before` option', function (assert) {
      const startDate = new Date();
      const beforeDate = startDate;

      const key = 'test_date';
      let options = { before: beforeDate, message: getCustomMessageHandler() };

      let validator = validateDate(options);

      assert.strictEqual(
        validator(key, startDate),
        buildMessage(key, { message: 'custom message: before' }),
        'date on or after the "before" date is not allowed'
      );
    });

    test('it accepts an `onOrBefore` option', function (assert) {
      const startDate = new Date();
      startDate.setHours(startDate.getHours() + 3);
      const onOrBeforeDate = new Date();

      const key = 'test_date';
      let options = {
        onOrBefore: onOrBeforeDate,
        message: getCustomMessageHandler(),
      };

      let validator = validateDate(options);

      assert.strictEqual(
        validator(key, startDate),
        buildMessage(key, { message: 'custom message: onOrBefore' }),
        'date after the "onOrBefore" date is not allowed'
      );
    });

    test('it accepts an `after` option', function (assert) {
      const startDate = new Date();
      startDate.setHours(startDate.getHours() - 4);
      const afterDate = new Date();

      const key = 'test_date';
      let options = { after: afterDate, message: getCustomMessageHandler() };

      let validator = validateDate(options);

      assert.strictEqual(
        validator(key, startDate),
        buildMessage(key, { message: 'custom message: after' }),
        'date on or before the "after" date is not allowed'
      );
    });

    test('it accepts an `onOrAfter` option', function (assert) {
      const startDate = new Date();
      startDate.setHours(startDate.getHours() - 5);
      const onOrAfterDate = new Date();

      const key = 'test_date';
      let options = {
        onOrAfter: onOrAfterDate,
        message: getCustomMessageHandler(),
      };

      let validator = validateDate(options);

      assert.strictEqual(
        validator(key, startDate),
        buildMessage(key, { message: 'custom message: onOrAfter' }),
        'date before the "onOrAfter" date is not allowed'
      );
    });
  });
});
