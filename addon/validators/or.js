import isPromise from 'ember-changeset/utils/is-promise';

function isTrue(value) {
  return value === true;
}

/**
 * Note: in ember-changeset-validations, a successful validation is one that:
 *
 *   a) returns `true`
 *   b) returns a Promise that resolves to `true`
 *
 * Example:
 *
 *   true                  => success
 *   resolve(true)         => success
 *   'some value'          => fail
 *   false                 => fail
 *   resolve('some value') => fail
 *   reject('some value')  => fail
 *   reject(true)          => fail
 */
function handleResult(result) {
  if (isTrue(result)) {
    throw true;
  }

  return result;
}

export default function or(...validators) {
  return (key, newValue, oldValue, changes, object) => {
    let result;

    for (let i = 0; i < validators.length; i++) {
      result = validators[i](key, newValue, oldValue, changes, object);

      // If a validator results in a Promise, then the remaining validator
      // results are treated as Promises.
      if (isPromise(result)) {
        let promise = result.then(handleResult, handleResult);

        for (let j = i+1; j < validators.length; j++) {
          promise = promise
            .then(() => validators[j](key, newValue, oldValue, changes, object))
            .then(handleResult, handleResult);
        }

        // Passthrough `true` value.
        return promise.catch(a => a);
      }

      // If a validator result is `true`, then short-circuit and return
      // the result.
      if (isTrue(result)) {
        return true;
      }
    }

    // If all validators resulted in `true`, then return the final result.
    return result;
  };
}
