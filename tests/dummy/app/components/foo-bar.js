import Component from '@glimmer/component';
import {
  validatePresence,
  validateLength,
} from 'ember-changeset-validations/validators';

const rulez = {
  age: validatePresence(true),
  firstName: [validatePresence(true), validateLength({ min: 2 })],
  lastName: [validatePresence(true), validateLength({ min: 2 })],
  state: {
    ny: [validatePresence(true), validateLength({ min: 2 })],
    wi: [validatePresence(true), validateLength({ min: 2 })],
  },
};

const schema = {
  age: null,
  firstName: null,
  lastName: null,
  state: {
    ny: null,
    wi: null,
  },
};

export default class FooBar extends Component {
  rulez = rulez;
  schema = schema;
}
