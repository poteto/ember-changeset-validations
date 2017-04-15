import { module, test } from 'qunit';
import or from 'ember-changeset-validations/validators/or';

module('Unit | Validator | or | sync validators');

const testCases = [
  {
    validators: [() => true, () => 'this is an error message'],
    expected: true
  },
  {
    validators: [() => true, () => false],
    expected: true
  },
  {
    validators: [() => true, () => true],
    expected: true
  },
  {
    validators: [
      () => 'first error',
      () => 'second error',
      () => 'third error'
    ],
    expected: 'third error'
  }
];

for (const { validators, expected } of testCases) {
  test('it works', function(assert) {
    const validationFn = or(...validators);
    const result = validationFn();
    assert.equal(result, expected);
  });
}

test('it short-circuits', function(assert) {
  const didExecute = [false, false];
  const validators = [
    () => { didExecute[0] = true; return true; },
    () => { throw new Error('This validator should not be reached.'); }
  ];
  const validationFn = or(...validators);
  validationFn();
  assert.deepEqual(didExecute, [true, false]);
});

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

test('it passes arguments to validators', function(assert) {
  const validationFn = or(
    (key, newValue, oldValue, changes, object) => [key, newValue, oldValue, changes, object]
  );
  const result = validationFn(1, 2, 3, 4, 5);
  assert.deepEqual(result, [1, 2, 3, 4, 5]);
});
