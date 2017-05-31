import Ember from 'ember';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import isObject from 'ember-changeset/utils/is-object';
import isPromise from 'ember-changeset/utils/is-promise';

const { Helper: { helper } } = Ember;

export function changeset([model, validationMap], options = {}) {
  if (isObject(validationMap)) {
    if (isPromise(model)) {
      return model.then((resolved) => new Changeset(resolved, lookupValidator(validationMap), validationMap, options));
    }

    return new Changeset(model, lookupValidator(validationMap), validationMap, options);
  }

  if (isPromise(model)) {
    return model.then((resolved) => new Changeset(resolved, validationMap, {}, options));
  }

  return new Changeset(model, validationMap, {}, options);
}

export default helper(changeset);
