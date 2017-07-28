import Ember from 'ember';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import isObject from 'ember-changeset/utils/is-object';
import isPromise from 'ember-changeset/utils/is-promise';

const { Helper: { helper } } = Ember;

function _createChangesetWithMap(model, validationMap, initValidation) {
  const chset = new Changeset(model, lookupValidator(validationMap), validationMap);

  if (initValidation) {
    chset.validate();
  }
  return chset;
}

function _createChangeset(model, validationFunction, initValidation) {
  const chset = new Changeset(model, validationFunction);

  if (initValidation) {
    chset.validate();
  }
  return chset;
}

export function changeset([model, validationMap], namedArgs) {
  const initValidation = "initValidation" in namedArgs ? true : false;

  if (isObject(validationMap)) {
    if (isPromise(model)) {
      return model.then((resolved) => _createChangesetWithMap(resolved, validationMap, initValidation));
    }

    return _createChangesetWithMap(model, validationMap, initValidation);
  }

  if (isPromise(model)) {
    return model.then((resolved) => _createChangeset(resolved, validationMap, initValidation));
  }

  return _createChangeset(model, validationMap, initValidation);
}

export default helper(changeset);
