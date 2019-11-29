import moment from 'moment';
import validateDate from 'ember-changeset-validations/validators/date';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

const inputFormat = "YYYY-MM-DD";
const errorOutputFormat = "MMM Do, YYYY"; // Jan 1st, 1999

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

    assert.equal(validator(key, 'not a date'), buildMessage(key, { type: 'date', value: 'not a date', context: options }),
      'non-date string is not allowed');
    assert.equal(validator(key, NaN), buildMessage(key, { type: 'date', value: NaN, context: options }),
      'NaN is not allowed');
    assert.equal(validator(key, {}), buildMessage(key, { type: 'date', value: {}, context: options }),
      'empty object is not allowed');
  });

  test('it accepts empty strings, null & undefined', function(assert) {
    const key = 'test_date';
    const options = {};
    const validator = validateDate(options);

    // assumes current moment
    assert.equal(validator(key, ''), true, 'empty string is allowed');
    assert.equal(validator(key, null), true);
    assert.equal(validator(key, undefined), true);
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
        context: {before: moment(options.before).format(errorOutputFormat)},
      }, 'date after the "before" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, futureDate),
      buildMessage(key, {
        type: 'before', value: futureDate,
        context: {before: moment(options.before).format(errorOutputFormat)},
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
        context: {before: moment(options.before).format(errorOutputFormat)},
      }, 'date after the "before" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, pastDate),
      buildMessage(key, {
        type: 'before', value: pastDate,
        context: {before: moment(options.before).format(errorOutputFormat)},
      }, 'date same as the "before" date is not allowed')
    );
    validator = validateDate(options);
    assert.equal(validator(key, moment(pastDate).subtract(1, 'days').format(inputFormat)), true);

  });
});
