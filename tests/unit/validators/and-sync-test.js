import { module, test } from 'qunit';
import and from 'ember-changeset-validations/validators/and';

module('Unit | Validator | and | sync validators');

const testCases = [
  {
    validators: [() => true, () => 'this is an error message'],
    expected: 'this is an error message'
  },
  {
    validators: [() => true, () => false],
    expected: false
  },
  {
    validators: [() => true, () => true],
    expected: true
  }
];

for (const { validators, expected } of testCases) {
  test('it works', function(assert) {
    const validationFn = and(...validators);
    const result = validationFn();
    assert.equal(result, expected);
  });
}

test('it short-circuits', function(assert) {
	const didExecute = [false, false];
	const validators = [
		() => { didExecute[0] = true; return undefined; },
		() => { throw new Error('This validator should not be reached.'); }
	];
	const validationFn = and(...validators);
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

test('it passes arguments to validators', function(assert) {
  const validationFn = and(
    (key, newValue, oldValue, changes, content) => [key, newValue, oldValue, changes, content]
  );
  const result = validationFn(1, 2, 3, 4, 5);
  assert.deepEqual(result, [1, 2, 3, 4, 5]);
});
