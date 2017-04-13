import isPromise from 'ember-changeset/utils/is-promise';

function isTrue(value) {
  return value === true;
}

function handleResult(result) {
  if (isTrue(result)) throw true;
  return result;
}

export default function or(...validators) {
  return (key, newValue, oldValue, changes, object) => {
    let validation;

    for (let i = 0; i < validators.length; i++) {
      validation = validators[i](key, newValue, oldValue, changes, object);

      if (isPromise(validation)) {
        let promise = validation.then(handleResult);

        for (let j = i+1; j < validators.length; j++) {
          promise = promise
            .then(() => validators[j](key, newValue, oldValue, changes, object))
            .then(handleResult);
        }

        return promise.catch(err => err);
      }

      if (isTrue(validation)) return true;
    }

    return validation;
  }
}
