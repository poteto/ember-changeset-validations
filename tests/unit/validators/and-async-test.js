import { module, test } from 'qunit';
import and from 'ember-changeset-validations/validators/and';
import Ember from 'ember';

const {
  RSVP: { resolve, reject }
} = Ember;

module('Unit | Validator | and | async validators');

const testCases = [
  {
    description: 'it returns `true` when all validators succeed',
    validators: [() => resolve(true), () => resolve(true)],
    expected: true
  },
  {
    description: 'it returns `true` when all validators succeed',
    validators: [() => resolve(true), () => true],
    expected: true
  },
  {
    description: 'it returns `true` when all validators succeed',
    validators: [() => true, () => resolve(true)],
    expected: true
  },
  {
    description: 'it returns the first encountered error',
    validators: [() => resolve(true), () => true, () => reject('rip')],
    expected: 'rip'
  },
  {
    description: 'it returns the first encountered error',
    validators: [() => reject(true), () => 'blah', () => reject('rip')],
    expected: true
  },
  {
    description: 'it returns the first encountered error',
    validators: [() => true, () => resolve('some value'), () => true],
    expected: 'some value'
  },
  {
    description: 'it passes arguments to validators',
    validators: [(key, newValue, oldValue, changes, content) => resolve([key, newValue, oldValue, changes, content])],
    expected: [1, 2, 3, 4, 5]
  }
];

for (const { description, validators, expected } of testCases) {
  test(description, async function(assert) {
    const validationFn = and(...validators);
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

  const validationFn = and(
    and(
      and(...validators1),
      and(...validators2)
    ),
    and(...validators3)
  );

  const result = await validationFn();
  assert.equal(result, 'first error');
});

test('it works with arbitrary nesting', async function(assert) {
  const validators1 = [
    () => resolve(true),
    () => resolve(true),
    () => resolve(true)
  ];

  const validators2 = [
    () => resolve(true),
    () => resolve('leeroy jenkins'),
    () => resolve(true)
  ];

  const validators3 = [
    () => resolve(true),
    () => resolve(true),
    () => resolve(true)
  ];

  const validationFn = and(
    and(
      and(...validators1),
      and(...validators2)
    ),
    and(...validators3)
  );

  const result = await validationFn();
  assert.equal(result, 'leeroy jenkins');
});
