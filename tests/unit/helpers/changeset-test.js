import Ember from 'ember';
import { changeset } from 'ember-changeset-validations/helpers/changeset';
import { module, test } from 'qunit';
import { validatePresence, validateLength } from 'ember-changeset-validations/validators';

const {
  Object: EmberObject,
  RSVP: { resolve },
  run
} = Ember;

function validateUnique() {
  return (_key, newValue) => {
    return resolve(newValue !== 'foo@bar.com' || 'is already taken');
  };
}

function validateContent() {
  return (_key, _newValue, _oldValue, _changes, content) => {
    return Boolean(content) || 'Content was not passed into validator';
  };
}

module('Unit | Helper | changeset');

test('it composes validations and uses custom validation messages', function(assert) {
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
  assert.deepEqual(changesetInstance.get('error.firstName.validation'), ['[CUSTOM] First name must be between 1 and 8 characters']);
  assert.ok(changesetInstance.get('isInvalid'), 'should be invalid with wrong length first name');

  changesetInstance.set('firstName', '');
  assert.deepEqual(changesetInstance.get('error.firstName.validation'), ["[CUSTOM] First name can't be blank", '[CUSTOM] First name must be between 1 and 8 characters']);
  assert.ok(changesetInstance.get('isInvalid'), 'should be invalid with blank first name');

  changesetInstance.set('lastName', '');
  assert.deepEqual(changesetInstance.get('error.lastName.validation'), ["[CUSTOM] Last name can't be blank"]);
  assert.ok(changesetInstance.get('isInvalid'), 'should be invalid with blank last name');

  changesetInstance.set('firstName', 'Jim');
  changesetInstance.set('lastName', 'Bob');
  assert.ok(changesetInstance.get('isValid'), 'should be valid after setting valid first and last names');
});

test('it works with async validators', function(assert) {
  let done = assert.async();
  let User = EmberObject.extend({
    username: null,
    email: null
  });
  let user = User.create();
  let userValidations = {
    email: validateUnique(),
    username: [
      validateUnique(),
      validateLength({ min: 2 })
    ]
  };
  let changesetInstance = changeset([user, userValidations]);

  run(() => changesetInstance.set('email', 'foo@bar.com'));
  run(() => {
    let expectedError = { value: 'foo@bar.com', validation: ['is already taken'] };
    assert.deepEqual(changesetInstance.get('error.email'), expectedError, 'email should error');
  });
  run(() => changesetInstance.set('username', 'jimbob'));
  run(() => {
    assert.deepEqual(changesetInstance.get('change.username'), 'jimbob', 'should set username');
  });
  run(() => changesetInstance.set('username', 'foo@bar.com'));
  run(() => {
    let expectedError = { value: 'foo@bar.com', validation: ['is already taken'] };
    assert.deepEqual(changesetInstance.get('error.username'), expectedError, 'username should error');
    done();
  });
});

test('it passes the original object into validators', function(assert) {
  let User = EmberObject.extend({
    firstName: null,
    lastName: null
  });
  let user = User.create();
  let userValidations = {
    firstName: validateContent(),
    lastName: [validateContent(), validateContent()]
  };
  let changesetInstance = changeset([user, userValidations]);

  changesetInstance.set('firstName', 'Herp');
  assert.ok(changesetInstance.get('isValid'), 'should be valid if content is passed into validator');

  changesetInstance.set('lastName', 'McDerpface');
  assert.ok(changesetInstance.get('isValid'), 'should be valid if content is passed into validator');
});
