import Ember from 'ember';
import Changeset from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';

const { Helper: { helper } } = Ember;

export function changeset([model, validationMap]) {
  return new Changeset(model, lookupValidator(validationMap));
}

export default helper(changeset);
