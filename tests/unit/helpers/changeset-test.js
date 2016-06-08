import Ember from 'ember';
import { changeset } from 'dummy/helpers/changeset';
import { module, test } from 'qunit';
import { validatePresence, validateLength } from 'ember-changeset-validations/validators';

const { Object: EmberObject } = Ember;

module('Unit | Helper | changeset');

test('it composes validations', function(assert) {
  let User = EmberObject.extend({
    firstName: null,
    lastName: null
  });
  let user = User.create();
  let userValidations = {
    firstName: [
      validatePresence(true),
      validateLength({ min: 1, max: 8 })
    ],
    lastName: validatePresence(true)
  };
  let changesetInstance = changeset([user, userValidations]);

  changesetInstance.set('firstName', 'helloworldjimbob');
  assert.deepEqual(changesetInstance.get('error.firstName.validation'), ['First name must be between 1 and 8 characters']);
  assert.ok(changesetInstance.get('isInvalid'), 'should be invalid with wrong length first name');

  changesetInstance.set('firstName', '');
  assert.deepEqual(changesetInstance.get('error.firstName.validation'), ["First name can't be blank", 'First name must be between 1 and 8 characters']);
  assert.ok(changesetInstance.get('isInvalid'), 'should be invalid with blank first name');

  changesetInstance.set('lastName', '');
  assert.deepEqual(changesetInstance.get('error.lastName.validation'), ["Last name can't be blank"]);
  assert.ok(changesetInstance.get('isInvalid'), 'should be invalid with blank last name');

  changesetInstance.set('firstName', 'Jim');
  changesetInstance.set('lastName', 'Bob');
  assert.ok(changesetInstance.get('isValid'), 'should be valid after setting valid first and last names');
});
