import isPromise from 'ember-changeset/utils/is-promise';

function isTrue(value) {
  return value === true;
}

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
        let promise = result.then(handleResult);

        for (let j = i+1; j < validators.length; j++) {
          promise = promise
            .then(() => validators[j](key, newValue, oldValue, changes, object))
            .then(handleResult);
        }

        return promise.catch(err => err);
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
