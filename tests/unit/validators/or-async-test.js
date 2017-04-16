import { module, test } from 'qunit';
import or from 'ember-changeset-validations/validators/or';
import Ember from 'ember';

const {
  RSVP: { resolve, reject }
} = Ember;

module('Unit | Validator | or | async validators');

const testCases = [
  {
    description: 'it returns the result of the last rejected Promise',
    validators: [() => reject('first'), () => reject('second'), () => reject('third')],
    expected: 'third'
  },
  {
    description: 'it returns the result of the last rejected Promise',
    validators: [() => reject(true), () => reject('foo')],
    expected: 'foo'
  },
  {
    description: 'it returns the result of the last resolved Promise',
    validators: [() => resolve('first error'), () => resolve('second error'), () => resolve('third error')],
    expected: 'third error'
  },
  {
    description: 'it short-circuits',
    validators: [() => reject('first'), () => true, () => reject('third')],
    expected: true
  },
  {
    description: 'it short-circuits',
    validators: [() => resolve(true), () => resolve('foo')],
    expected: true
  },
  {
    description: 'it short-circuits',
    validators: [() => resolve(true), () => reject('foo'), () => reject('bar')],
    expected: true
  },
  {
    description: 'it passes arguments to validators',
    validators: [(key, newValue, oldValue, changes, content) => resolve([key, newValue, oldValue, changes, content])],
    expected: [1, 2, 3, 4, 5]
  }
];

for (const { description, validators, expected } of testCases) {
  test(description, async function(assert) {
    const validationFn = or(...validators);
    const result = await validationFn(1, 2, 3, 4, 5);
    assert.deepEqual(result, expected);
  });
}

test('it works with arbitrary nesting', async function(assert) {
  const validators1 = [
    () => resolve('first error'),
    () => resolve('second error'),
    () => resolve('third error')
  ];

  const validators2 = [
    () => resolve('fourth error'),
    () => resolve('fifth error'),
    () => resolve('sixth error')
  ];

  const validators3 = [
    () => resolve('seventh error'),
    () => resolve('eighth error'),
    () => resolve('ninth error')
  ];

  const validationFn = or(
    or(
      or(...validators1),
      or(...validators2)
    ),
    or(...validators3)
  );

  const result = await validationFn();
  assert.equal(result, 'ninth error');
});

test('it works with arbitrary nesting', async function(assert) {
  const validators1 = [
    () => resolve('first error'),
    () => resolve('second error'),
    () => resolve('third error')
  ];

  const validators2 = [
    () => resolve('fourth error'),
    () => resolve(true),
    () => resolve('sixth error')
  ];

  const validators3 = [
    () => resolve('seventh error'),
    () => resolve('eighth error'),
    () => resolve('ninth error')
  ];

  const validationFn = or(
    or(
      or(...validators1),
      or(...validators2)
    ),
    or(...validators3)
  );

  const result = await validationFn();
  assert.equal(result, true);
});
