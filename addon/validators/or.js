import isPromise from 'ember-changeset/utils/is-promise';

/**
 * Note: in ember-changeset-validations, a successful validation is one
 * that:
 *
 *   a) returns `true`, or
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
 *
 * Thus, to implement `or`'s short-circuit behavior, we need to treat
 * `true` as an exceptional value. So we throw `TrueSymbol` whenever
 * `true` is encountered, and catch the exception in the final handler.
 */

const TrueSymbol = {};

function handleResult(result) {
  if (result === true) {
    throw TrueSymbol;
  }

  return result;
}

function handleError(err) {
  if (err === TrueSymbol) {
    throw err;
  }

  return err;
}

function handleFinally(result) {
  if (result === TrueSymbol) {
    return true;
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
        let promise = result.then(handleResult, handleError);

        for (let j = i+1; j < validators.length; j++) {
          promise = promise
            .then(() => validators[j](key, newValue, oldValue, changes, object))
            .then(handleResult, handleError);
        }

        return promise.catch(handleFinally);
      }

      // If a validator result is `true`, then short-circuit and return
      // the result.
      if (result === true) {
        return true;
      }
    }

    // If all validators resulted in `true`, then return the final result.
    return result;
  };
}
