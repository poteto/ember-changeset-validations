import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import withDefaults from 'ember-changeset-validations/utils/with-defaults';
import toDate from 'ember-changeset-validations/utils/to-date';

const errorFormat = "MMM Do, YYYY";

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

export default function validateDate(options = {}) {
  options = withDefaults(options, { allowBlank: false, errorFormat: errorFormat });

  return (key, value) => {
    let { allowBlank } = options;
    let { before, onOrBefore, after, onOrAfter, message } = options;

    if (allowBlank && (typeof value === 'undefined' || value === null)) {
      return true;
    }

    let date = toDate(value);

    if (!isValidDate(date)) {
      return buildMessage(key, { type: 'date', value: message || 'not a date' });
    }

    if (before) {
      before = toDate(before);

      if (date >= before) {
        return buildMessage(key, { value, message: message || `[BEFORE] date is NOT before ${value}` });
      }
    }

    if (onOrBefore) {
      onOrBefore = toDate(onOrBefore);

      if (date > onOrBefore) {
        return buildMessage(key, { value, message: message || `[ON OR BEFORE] date is NOT on or before ${value}` });
      }
    }

    if (after) {
      after = toDate(after);

      if (date <= after) {
        return buildMessage(key, { value, message: message || `[AFTER] date is NOT after ${value}` });
      }
    }

    if (onOrAfter) {
      onOrAfter = toDate(onOrAfter);

      if (date < onOrAfter) {
        return buildMessage(key, { value, message: message || `[ON OR AFTER] date is NOT on or after ${value}` });
      }
    }

    return true;
  };
}

export { errorFormat };
