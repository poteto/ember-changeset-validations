import { module, test } from 'qunit';
import and from 'ember-changeset-validations/validators/and';

module('Unit | Validator | and | sync validators');

test('it works with an argument list', function(assert) {
	const testCases = [
		{
			validators: [() => true, () => 'this is an error message'],
			expected: 'this is an error message',
		},
		{
			validators: [() => true, () => false],
			expected: false
		},
		{
			validators: [() => true, () => true],
			expected: true
		},
	];

	for (const { validators, expected } of testCases) {
		const validationFn = and(...validators);
		assert.equal(validationFn(), expected);
	}
});

test('it short-circuits', function(assert) {
	const didExecute = [false, false, false];
	const validators = [
		() => didExecute[0] = true,
		() => false,
		() => { throw new Error('This validator should not be reached.'); },
	];
	const validationFn = and(...validators);
	validationFn();
	assert.deepEqual(didExecute, [true, false, false]);
});

test('it works with arbitrary nesting', function(assert) {
	{
		const validators1 = [
			() => 'first error',
			() => 'second error',
			() => 'third error',
		];

		const validators2 = [
			() => 'fourth error',
			() => 'fifth error',
			() => 'sixth error',
		];

		const validators3 = [
			() => 'seventh error',
			() => 'eighth error',
			() => 'ninth error',
		];

		const validationFn = and(
			and(
				and(...validators1),
				and(...validators2)
			),
			and(...validators3)
		);

		assert.equal(validationFn(), 'first error');
	}

	{
		const validators1 = [
			() => true,
			() => true,
			() => true,
		];

		const validators2 = [
			() => true,
			() => 'leeroy jenkins',
			() => true,
		];

		const validators3 = [
			() => true,
			() => true,
			() => true,
		];

		const validationFn = and(
			and(
				and(...validators1),
				and(...validators2)
			),
			and(...validators3)
		);

		assert.equal(validationFn(), 'leeroy jenkins');
	}
});

test('it passes arguments to validators', function(assert) {
	{
		const validators = [
			(key, newValue, oldValue, changes, object) => [key, newValue, oldValue, changes, object],
			(key, newValue) => true,
			(key, newValue) => true,
		]

		const validationFn = and(...validators);
		assert.deepEqual(validationFn(1, 2, 3, 4, 5), [1, 2, 3, 4, 5]);
	}

	{
		const validators = [
			(key, newValue) => true,
			(key, newValue, oldValue, changes, object) => [key, newValue, oldValue, changes, object],
			(key, newValue) => true,
		];

		const validationFn = and(...validators);
		assert.deepEqual(validationFn(1, 2, 3, 4, 5), [1, 2, 3, 4, 5]);
	}
});
