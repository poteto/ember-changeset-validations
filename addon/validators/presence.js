import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import evValidatePresence from 'ember-validators/presence';
import { get } from '@ember/object';

export default function validatePresence(options) {
  let targets;
  if (typeof options === 'boolean') {
    options = { presence: options };
  } else if (options && options.on !== undefined) {
    if (typeof options.on === 'string') {
      targets = [options.on];
    } else if (Array.isArray(options.on)) {
      targets = options.on;
    }

    delete options.on;
  }

  return (key, value, _oldValue, changes, content) => {
    if (
      targets &&
      !targets.some((target) => {
        const change = get(changes, target);
        return change || (change === undefined && get(content, target));
      })
    ) {
      return true;
    }

    let result = evValidatePresence(value, options, null, key);

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
