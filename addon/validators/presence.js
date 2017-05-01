import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { validate } from 'ember-validators';

export default function validatePresence(options) {
  if (typeof options === 'boolean') {
    options = { presence: options };
  }

  return (key, value) => {
    let result = validate('presence', value, options, null, key);

    if (typeof result === 'boolean' || typeof result === 'string') {
      return result;
    } else {
      // We flipped the meaning behind `present` and `blank` so switch the two
      if (result.type === 'present') {
        result.type = 'blank';
      } else if (result.type === 'blank') {
        result.type = 'present';
      }

      return buildMessage(key, result);
    }
  };
}
