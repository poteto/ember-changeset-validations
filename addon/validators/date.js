import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import withDefaults from 'ember-changeset-validations/utils/with-defaults';
import toDate from 'ember-changeset-validations/utils/to-date';

const errorFormat = 'MMM Do, YYYY';

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

export default function validateDate(options = {}) {
  options = withDefaults(options, {
    allowBlank: false,
    errorFormat: errorFormat,
  });

  return (key, value) => {
    let { allowBlank } = options;
    let { before, onOrBefore, after, onOrAfter, message } = options;
    let type = 'date';

    if (allowBlank && (typeof value === 'undefined' || value === null)) {
      return true;
    }

    let date = toDate(value);

    if (!isValidDate(date)) {
      return buildMessage(key, {
        type,
        value: 'not a date',
        context: { value, message },
      });
    }

    if (before) {
      before = toDate(before);
      message = message || `[BEFORE] date is NOT before ${value}`;
      type = 'before';

      if (date >= before) {
        return buildMessage(key, { type, value, context: { before, message } });
      }
    }

    if (onOrBefore) {
      onOrBefore = toDate(onOrBefore);
      message = message || `[ON OR BEFORE] date is NOT on or before ${value}`;
      type = 'onOrBefore';

      if (date > onOrBefore) {
        return buildMessage(key, {
          type,
          value,
          context: { onOrBefore, message },
        });
      }
    }

    if (after) {
      after = toDate(after);
      message = message || `[AFTER] date is NOT after ${value}`;
      type = 'after';

      if (date <= after) {
        return buildMessage(key, { type, value, context: { after, message } });
      }
    }

    if (onOrAfter) {
      onOrAfter = toDate(onOrAfter);
      message = message || `[ON OR AFTER] date is NOT on or after ${value}`;
      type = 'onOrAfter';

      if (date < onOrAfter) {
        return buildMessage(key, {
          type,
          value,
          context: { onOrAfter, message },
        });
      }
    }

    return true;
  };
}

export { errorFormat };
