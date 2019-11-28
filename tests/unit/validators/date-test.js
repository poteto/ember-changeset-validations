import validateDate from 'ember-changeset-validations/validators/date';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | date', function() {
  test('it accepts an `allowBlank` option', function(assert) {
    let key = 'birth_date';
    let options = { allowBlank: true };
    let validator = validateDate(options);

    assert.equal(validator(key, ''), true, 'empty string is allowed');
    assert.equal(validator(key, null), true, 'null is allowed');
    assert.equal(validator(key, undefined), true, 'undefined is allowed');
    assert.equal(validator(key, '1992-03-30'), true, 'date string is allowed');

    assert.equal(validator(key, 'not a date'), buildMessage(key, { type: 'date', value: 'not a date', context: options }),
      'non-date string is not allowed');
    assert.equal(validator(key, NaN), buildMessage(key, { type: 'date', value: NaN, context: options }),
      'NaN is not allowed');
  });
});
