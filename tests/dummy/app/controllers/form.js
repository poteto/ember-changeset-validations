import Controller from '@ember/controller';
import { action } from "@ember/object";

import {
  validateLength,
  validatePresence
} from 'ember-changeset-validations/validators';

const MyValidationClass = {
  title: [
    validatePresence(true),
    validateLength({ min: 44 })
  ]
};

export default class MyController extends Controller {
  MyValidationClass = MyValidationClass;
  model = {
    title: 'initial'
  };

  @action
  submit(changeset) {
    changeset.save()
  }
}
