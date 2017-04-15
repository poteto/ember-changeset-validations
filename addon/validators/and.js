import isPromise from 'ember-changeset/utils/is-promise';
import Ember from 'ember';

function notTrue(value) {
  return Ember.typeOf(value) !== 'boolean' || !value;
}

function handleResult(result) {
  if (notTrue(result)) {
    throw result;
  }

  return true;
}

export default function and(...validators) {
  return (key, newValue, oldValue, changes, content) => {
    for (let i = 0; i < validators.length; i++) {
      let result = validators[i](key, newValue, oldValue, changes, content);

      // If a validator results in a Promise, then the remaining validator
      // results are treated as Promises.
      if (isPromise(result)) {
        let promise = result.then(handleResult);

        for (let j = i+1; j < validators.length; j++) {
          promise = promise
            .then(() => validators[j](key, newValue, oldValue, changes, content))
            .then(handleResult);
        }

        return promise.catch(err => err);
      }

      // If a validator result is not `true`, then short-circuit and return
      // the result.
      if (notTrue(result)) {
        return result;
      }
    }

    // If all validators resulted in `true`, then return `true`.
    return true;
  };
}
