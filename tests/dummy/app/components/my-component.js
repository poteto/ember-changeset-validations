import Component from '@ember/component';
import { action } from '@ember/object';

export default class MyComponent extends Component {
  @action
  async submit(changeset) {
    await changeset.validate();

    if(changeset.isValid) // returns true even when the validation should fail
      this.args.onSubmit(changeset);
  }
}
