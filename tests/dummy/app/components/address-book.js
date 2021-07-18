import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import { Changeset } from 'ember-changeset';
import lookupValidator from 'ember-changeset-validations';
import { validatePresence } from 'ember-changeset-validations/validators';

const validations = {
  name: validatePresence({
    presence: true,
    message: 'Заполните поле',
  }),
};

export default class AddressBookForm extends Component {
  @tracked formChangeset = null;

  constructor() {
    super(...arguments);

    this.formChangeset = new Changeset(
      this.args.model,
      lookupValidator(validations),
      validations
    );
  }

  @action
  onBlur(fieldName) {
    this.formChangeset.validate(fieldName);
  }

  @action
  async onSubmit(event) {
    event.preventDefault();

    await this.formChangeset.validate();

    const isInvalid = this.formChangeset.get('isInvalid');

    if (isInvalid) {
      return;
    }

    this.args.onSave(this.formChangeset);
  }
}
