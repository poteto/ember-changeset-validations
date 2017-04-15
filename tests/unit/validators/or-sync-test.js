import { module, test } from 'qunit';
import or from 'ember-changeset-validations/validators/or';

module('Unit | Validator | or | sync validators');

test('it works with an argument list', function(assert) {
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
	];

	for (const { validators, expected } of testCases) {
		const validationFn = or(...validators);
		assert.equal(validationFn(), expected);
	}
});

test('it short-circuits', function(assert) {
	const didExecute = [false, false, false];
	const validators = [
		() => { didExecute[0] = true; return false; },
		() => true,
		() => { throw new Error('This validator should not be reached.'); },
	];
	const validationFn = or(...validators);
	validationFn();
	assert.deepEqual(didExecute, [true, false, false]);
});

test('it returns the last error if all validators return errors', function(assert) {
	const validators = [
		() => 'first error',
		() => 'second error',
		() => 'third error',
	];

	const validationFn = or(...validators);
	assert.equal(validationFn(), 'third error');
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

		const validationFn = or(
			or(
				or(...validators1),
				or(...validators2)
			),
			or(...validators3)
		);

		assert.equal(validationFn(), 'ninth error');
	}

	{
		const validators1 = [
			() => 'first error',
			() => 'second error',
			() => 'third error',
		];

		const validators2 = [
			() => 'fourth error',
			() => true, // derp
			() => 'sixth error',
		];

		const validators3 = [
			() => 'seventh error',
			() => 'eighth error',
			() => 'ninth error',
		];

		const validationFn = or(
			or(
				or(...validators1),
				or(...validators2)
			),
			or(...validators3)
		);

		assert.equal(validationFn(), true);
	}
});

test('it passes arguments to validators', function(assert) {
	{
		const validators = [
			(key, newValue, oldValue, changes, object) => [key, newValue, oldValue, changes, object],
		];

		const validationFn = or(...validators);
		assert.deepEqual(validationFn(1, 2, 3, 4, 5), [1, 2, 3, 4, 5]);
	}

	{
		const validators = [
			(key, newValue) => false,
			(key, newValue, oldValue, changes, object) => [key, newValue, oldValue, changes, object],
		];

		const validationFn = or(...validators);
		assert.deepEqual(validationFn(1, 2, 3, 4, 5), [1, 2, 3, 4, 5]);
	}
});
