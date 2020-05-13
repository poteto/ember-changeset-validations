import EmberObject from '@ember/object';
import { resolve } from 'rsvp';
import { settled } from '@ember/test-helpers';
import { changeset } from 'ember-changeset-validations/helpers/changeset';
import { module, test } from 'qunit';
import { validatePresence, validateLength } from 'ember-changeset-validations/validators';

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

module('Unit | Helper | changeset', function() {
  test('it composes validations and uses custom validation messages', async function(assert) {
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
    assert.deepEqual(changesetInstance.get('error').firstName.validation, ['[CUSTOM] First name must be between 1 and 8 characters']);
    assert.ok(changesetInstance.get('isInvalid'), 'should be invalid with wrong length first name');

    changesetInstance.set('firstName', '');
    assert.deepEqual(changesetInstance.get('error').firstName.validation, ["[CUSTOM] First name can't be blank", '[CUSTOM] First name must be between 1 and 8 characters']);
    assert.ok(changesetInstance.get('isInvalid'), 'should be invalid with blank first name');

    changesetInstance.set('lastName', '');
    assert.deepEqual(changesetInstance.get('error').lastName.validation, "[CUSTOM] Last name can't be blank");
    assert.ok(changesetInstance.get('isInvalid'), 'should be invalid with blank last name');

    changesetInstance.set('firstName', 'Jim');
    changesetInstance.set('lastName', 'Bob');
    assert.ok(changesetInstance.get('isValid'), 'should be valid after setting valid first and last names');
  });

  test('it works with async validators', async function(assert) {
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

    changesetInstance.set('email', 'foo@bar.com');
    await settled();
    let expectedError = { value: 'foo@bar.com', validation: 'is already taken' };
    assert.deepEqual(JSON.parse(JSON.stringify(changesetInstance.get('error').email)), expectedError, 'email should error');

    changesetInstance.set('username', 'jimbob');
    await settled();
    assert.deepEqual(changesetInstance.get('change').username, 'jimbob', 'should set username');

    changesetInstance.set('username', 'foo@bar.com');
    await settled();
    expectedError = { value: 'foo@bar.com', validation: ['is already taken'] };
    const result = JSON.parse(JSON.stringify(changesetInstance.get('error').username));
    console.warn(result, expectedError)
    assert.deepEqual(result, expectedError, 'username should error');
  });

  test('it passes the original object into validators', async function(assert) {
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

  test('it works with models that are promises', async function(assert) {
    let User = EmberObject.extend({
      firstName: null,
      lastName: null
    });
    let user = resolve(User.create());
    let userValidations = {
      firstName: validatePresence(true),
      lastName: validatePresence(true)
    };

    let changesetInstance = await changeset([user, userValidations]);
    changesetInstance.validate().then(() => {
      assert.deepEqual(changesetInstance.get('error').firstName.validation, "[CUSTOM] First name can't be blank");
      assert.ok(changesetInstance.get('isInvalid'), 'should be invalid with wrong length first name');

      changesetInstance.set('firstName', 'Jim');
      changesetInstance.set('lastName', 'Bob');
      assert.ok(changesetInstance.get('isValid'), 'should be valid after setting valid first and last names');
    });
  });

  test('it passes through options to the changeset object', async function(assert) {
    let User = EmberObject.extend({
      firstName: null,
      lastName: null
    });
    let userValidations = {
      firstName: validatePresence(true),
      lastName: validatePresence(true)
    };

    let changesetInstance = changeset([User.create(), userValidations], { skipValidate: true });
    assert.ok(changesetInstance.get('_options').skipValidate, 'option should have been passed through');

    changesetInstance.set('firstName', '');
    assert.ok(changesetInstance.get('isValid'), 'should not have validated');
  });
});
