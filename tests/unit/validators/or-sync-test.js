import { module, test } from 'qunit';
import or from 'ember-changeset-validations/validators/or';

module('Unit | Validator | or | sync validators');

const testCases = [
  {
    description: 'it short-circuits on first validator',
    validators: [() => true, () => 'this is an error'],
    expected: true
  },
  {
    description: 'it returns the last error',
    validators: [() => 'first error', () => 'second error'],
    expected: 'second error'
  },
  {
    description: 'it returns the last error',
    validators: [() => false, () => undefined],
    expected: undefined
  },
  {
    description: 'it works when all validators return true',
    validators: [() => true, () => true],
    expected: true
  },
  {
    description: 'it passes arguments to validators',
    validators: [(key, newValue, oldValue, changes, object) => [key, newValue, oldValue, changes, object]],
    expected: [1, 2, 3, 4, 5]
  }
];

for (const { description, validators, expected } of testCases) {
  test(description, function(assert) {
    const validationFn = or(...validators);
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

  const validationFn = or(
    or(
      or(...validators1),
      or(...validators2)
    ),
    or(...validators3)
  );

  const result = validationFn();
  assert.equal(result, 'ninth error');
});

test('it works with arbitrary nesting', function(assert) {
  const validators1 = [
    () => 'first error',
    () => 'second error',
    () => 'third error'
  ];

  const validators2 = [
    () => 'fourth error',
    () => true,
    () => 'sixth error'
  ];

  const validators3 = [
    () => 'seventh error',
    () => 'eighth error',
    () => 'ninth error'
  ];

  const validationFn = or(
    or(
      or(...validators1),
      or(...validators2)
    ),
    or(...validators3)
  );

  const result = validationFn();
  assert.equal(result, true);
});
