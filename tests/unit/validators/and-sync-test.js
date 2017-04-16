import { module, test } from 'qunit';
import and from 'ember-changeset-validations/validators/and';

module('Unit | Validator | and | sync validators');

const testCases = [
  {
    description: 'it returns the first encountered error',
    validators: [() => true, () => 'this is an error message'],
    expected: 'this is an error message'
  },
  {
    description: 'it returns the first encountered error',
    validators: [() => true, () => false, () => 'this should not be returned'],
    expected: false
  },
  {
    description: 'it returns `true` when all validators succeed',
    validators: [() => true, () => true],
    expected: true
  },
  {
    description: 'it passes arguments to validators',
    validators: [(key, newValue, oldValue, changes, content) => [key, newValue, oldValue, changes, content]],
    expected: [1, 2, 3, 4, 5]
  }
];

for (const { description, validators, expected } of testCases) {
  test(description, function(assert) {
    const validationFn = and(...validators);
    const result = validationFn(1, 2, 3, 4, 5);
    assert.deepEqual(result, expected);
  });
}

test('it works with arbitrary nesting', function(assert) {
  const validators1 = [
    () => 'first error',
    () => 'second error',
    () => 'third error'
  ];

  const validators2 = [
    () => 'fourth error',
    () => 'fifth error',
    () => 'sixth error'
  ];

  const validators3 = [
    () => 'seventh error',
    () => 'eighth error',
    () => 'ninth error'
  ];

  const validationFn = and(
    and(
      and(...validators1),
      and(...validators2)
    ),
    and(...validators3)
  );

  const result = validationFn();
  assert.equal(result, 'first error');
});

test('it works with arbitrary nesting', function(assert) {
  const validators1 = [
    () => true,
    () => true,
    () => true
  ];

  const validators2 = [
    () => true,
    () => 'leeroy jenkins',
    () => true
  ];

  const validators3 = [
    () => true,
    () => true,
    () => true
  ];

  const validationFn = and(
    and(
      and(...validators1),
      and(...validators2)
    ),
    and(...validators3)
  );

  const result = validationFn();
  assert.equal(result, 'leeroy jenkins');
});
