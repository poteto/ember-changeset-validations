import { helper } from '@ember/component/helper';
import { changeset as EmberChangeset } from 'ember-changeset/helpers/changeset';

export function changeset([obj, validations], options) {
  return EmberChangeset([obj, validations], options);
}

export default helper(changeset);
