import { helper } from '@ember/component/helper';
import EmberChangeset from 'ember-changeset/helpers/changeset';

export function changeset(...args) {
  return EmberChangeset(...args);
}

export default helper(changeset);
