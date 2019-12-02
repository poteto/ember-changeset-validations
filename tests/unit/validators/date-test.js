import moment from 'moment';
import validateDate, { errorFormat as errorOutputFormat } from 'ember-changeset-validations/validators/date';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

const inputFormat = "YYYY-MM-DD";

module('Unit | Validator | date', function() {
  test('it accepts an `allowBlank` option', function(assert) {
    let key = 'birth_date';
    let options = { allowBlank: true };
    let validator = validateDate(options);
    
    assert.equal(validator(key, null), true, 'null is allowed');
    assert.equal(validator(key, undefined), true, 'undefined is allowed');
    assert.equal(validator(key, 123), true, 'number value is is allowed'); // valid for momentjs  ¯\_(ツ)_/¯
    assert.equal(validator(key, '1992-03-30'), true, 'date string is allowed');
    assert.equal(validator(key, 'now'), true, '"now" value is is allowed');

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

  test('it accepts valid values', function(assert) {
    const key = 'test_date';
    const options = {};
    const validator = validateDate(options);

    // assumes current moment
    assert.equal(validator(key, ''), true, 'empty string is allowed');
    assert.equal(validator(key, null), true);
    assert.equal(validator(key, undefined), true);
    assert.equal(validator(key, '1992-03-30'), true, 'date string is allowed');
    assert.equal(validator(key, 'now'), true, '"now" value is is allowed');
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
    const futureDate = '3000-01-01';
    const pastDate = '1900-01-01';

    const key = 'test_date';
    const options = { before: futureDate };

    let validator = validateDate(options);

    // Testing with before date in the future
    assert.equal(validator(key, moment(futureDate).add(1, 'days').format(inputFormat)),
      buildMessage(key, {
        type: 'before', value: moment(futureDate).add(1, 'days').format(inputFormat),
        context: { before: moment(options.before).format(errorOutputFormat) },
      }, 'date after the "before" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, futureDate),
      buildMessage(key, {
        type: 'before', value: futureDate,
        context: { before: moment(options.before).format(errorOutputFormat) },
      }, 'date same as the "before" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, moment(futureDate).subtract(1, 'days').format(inputFormat)), true);


    // Testing with before date in the past
    options.before = pastDate;
    validator = validateDate(options);
    assert.equal(validator(key, moment(pastDate).add(1, 'days').format(inputFormat)),
      buildMessage(key, {
        type: 'before', value: moment(pastDate).add(1, 'days').format(inputFormat),
        context: { before: moment(options.before).format(errorOutputFormat) },
      }, 'date after the "before" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, pastDate),
      buildMessage(key, {
        type: 'before', value: pastDate,
        context: { before: moment(options.before).format(errorOutputFormat) },
      }, 'date same as the "before" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, moment(pastDate).subtract(1, 'days').format(inputFormat)), true);
  });

  test('it accepts an `onOrBefore` option', function(assert) {
    const futureDate = '3000-01-01';
    const pastDate = '1900-01-01';

    const key = 'test_date';
    const options = { onOrBefore: futureDate };

    let validator = validateDate(options);

    // Testing with before date in the future
    assert.equal(validator(key, moment(futureDate).add(1, 'days').format(inputFormat)),
      buildMessage(key, {
        type: 'onOrBefore', value: moment(futureDate).add(1, 'days').format(inputFormat),
        context: { onOrBefore: moment(options.onOrBefore).format(errorOutputFormat) },
      }, 'date after the "onOrBefore" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, futureDate), true, 'date same as the "onOrBefore" date is allowed');
    validator = validateDate(options);
    assert.equal(validator(key, moment(futureDate).subtract(1, 'days').format(inputFormat)), true);


    // Testing with before date in the past
    options.onOrBefore = pastDate;
    validator = validateDate(options);
    assert.equal(validator(key, moment(pastDate).add(1, 'days').format(inputFormat)),
      buildMessage(key, {
        type: 'onOrBefore', value: moment(pastDate).add(1, 'days').format(inputFormat),
        context: { onOrBefore: moment(options.onOrBefore).format(errorOutputFormat) },
      }, 'date after the "onOrBefore" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, pastDate), true, 'date same as the "onOrBefore" date is allowed');
    validator = validateDate(options);
    assert.equal(validator(key, moment(pastDate).subtract(1, 'days').format(inputFormat)), true);
  });

  test('it accepts an `after` option', function(assert) {
    const futureDate = '3000-01-01';
    const pastDate = '1900-01-01';

    const key = 'test_date';
    const options = { after: futureDate };

    let validator = validateDate(options);

    // Testing with after date in the future
    assert.equal(validator(key, moment(futureDate).subtract(1, 'days').format(inputFormat)),
      buildMessage(key, {
        type: 'after', value: moment(futureDate).subtract(1, 'days').format(inputFormat),
        context: { after: moment(options.after).format(errorOutputFormat) },
      }, 'date after the "after" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, futureDate),
      buildMessage(key, {
        type: 'after', value: futureDate,
        context: { after: moment(options.after).format(errorOutputFormat) },
      }, 'date same as the "after" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, moment(futureDate).add(1, 'days').format(inputFormat)), true);


    // Testing with after date in the past
    options.after = pastDate;
    validator = validateDate(options);
    assert.equal(validator(key, moment(pastDate).subtract(1, 'days').format(inputFormat)),
      buildMessage(key, {
        type: 'after', value: moment(pastDate).subtract(1, 'days').format(inputFormat),
        context: { after: moment(options.after).format(errorOutputFormat) },
      }, 'date after the "after" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, pastDate),
      buildMessage(key, {
        type: 'after', value: pastDate,
        context: { after: moment(options.after).format(errorOutputFormat) },
      }, 'date same as the "after" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, moment(pastDate).add(1, 'days').format(inputFormat)), true);
  });

  test('it accepts an `onOrAfter` option', function(assert) {
    const futureDate = '3000-01-01';
    const pastDate = '1900-01-01';

    const key = 'test_date';
    const options = { onOrAfter: futureDate };

    let validator = validateDate(options);

    // Testing with after date in the future
    assert.equal(validator(key, moment(futureDate).subtract(1, 'days').format(inputFormat)),
      buildMessage(key, {
        type: 'onOrAfter', value: moment(futureDate).subtract(1, 'days').format(inputFormat),
        context: { onOrAfter: moment(options.onOrAfter).format(errorOutputFormat) },
      }, 'date after the "onOrAfter" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, futureDate), true, 'date same as the "onOrAfter" date is allowed');
    validator = validateDate(options);
    assert.equal(validator(key, moment(futureDate).add(1, 'days').format(inputFormat)), true);


    // Testing with after date in the past
    options.onOrAfter = pastDate;
    validator = validateDate(options);
    assert.equal(validator(key, moment(pastDate).subtract(1, 'days').format(inputFormat)),
      buildMessage(key, {
        type: 'onOrAfter', value: moment(pastDate).subtract(1, 'days').format(inputFormat),
        context: { onOrAfter: moment(options.onOrAfter).format(errorOutputFormat) },
      }, 'date after the "onOrAfter" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, pastDate), true, 'date same as the "onOrAfter" date is allowed');
    validator = validateDate(options);
    assert.equal(validator(key, moment(pastDate).add(1, 'days').format(inputFormat)), true);
  });

  test('it accepts a `precision` option', function(assert) {
    const beforeTarget = '1950-11-20';
    const key = 'test_date';
    const options = { before: beforeTarget, precision: 'year' };
    let validator = validateDate(options);

    validator = validateDate(options);
    assert.equal(validator(key, moment(beforeTarget).subtract(1, 'month').format(inputFormat)),
      buildMessage(key, {
        type: 'before', value: beforeTarget,
        context: { before: moment(options.before).format(errorOutputFormat) },
      }, 'date within the same year as the "before" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, moment(beforeTarget).subtract(1, 'year').format(inputFormat)), true);
  });

  test('it accepts a `format` option', function(assert) {
    const key = 'test_date';
    const options = {};
    let validator = validateDate(options);

    options.format = 'YYYY'
    validator = validateDate(options);
    assert.equal(validator(key, '1-1-1999'),
      buildMessage(key, { type: 'wrongDateFormat', value: '1-1-1999', context: options }), 'format should be just year'
    );
    assert.equal(validator(key, '1999'), true);

    options.format = 'MMM || Do || YYYY'
    validator = validateDate(options);
    assert.equal(validator(key, '11-3-1998'),
      buildMessage(key, { type: 'wrongDateFormat', value: '1-1-1999', context: options }), 'format should be "MMM || Do || YYYY"'
    );
    assert.equal(validator(key, 'Nov || 3rd || 1998'), true);
  });

});
