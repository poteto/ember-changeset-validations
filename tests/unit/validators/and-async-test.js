import { module, test } from 'qunit';
import and from 'ember-changeset-validations/validators/and';
import Ember from 'ember';

module('Unit | Validator | and | async validators');

/**
 * @param {Number} ms
 */
function resolveAfter(ms) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    try {
      Ember.run.later(resolve, true, ms);
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Note: ember-changeset treats anything that isn't the value `true` as
 * a failed validation.
 *
 * @param {Number} ms
 * @param {String} errorMessage
 */
function rejectAfter(ms, errorMessage) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    try {
      Ember.run.later(resolve, errorMessage, ms);
    } catch (err) {
      reject(err);
    }
  });
}

test('it works with an argument list', async function(assert) {
	const testCases = [
		{
			validators: [() => resolveAfter(1), () => resolveAfter(2), () => resolveAfter(3)],
			expected: true,
		},
		{
			validators: [() => resolveAfter(1), () => true, () => resolveAfter(3)],
			expected: true,
		},
		{
			validators: [() => resolveAfter(1), () => true, () => rejectAfter(3, 'rip')],
			expected: 'rip',
		},
	];

	for (const { validators, expected } of testCases) {
		const validationFn = and(...validators);
		const result = await validationFn();
		assert.equal(result, expected);
	}
});

test('it short-circuits', async function(assert) {
	const didExecute = [false, false, false];
	const validators = [
		() => resolveAfter(1).then(() => didExecute[0] = true),
		() => resolveAfter(1).then(() => false),
		() => resolveAfter(1).then(() => { throw new Error('This validator should not be reached.') }),
	];
	const validationFn = and(...validators);
	await validationFn();
	assert.deepEqual(didExecute, [true, false, false]);
});

test('it works with arbitrary nesting', async function(assert) {
	{
		const validators1 = [
			() => Ember.RSVP.resolve('first error'),
			() => Ember.RSVP.resolve('second error'),
			() => Ember.RSVP.resolve('third error'),
		];

		const validators2 = [
			() => Ember.RSVP.resolve('fourth error'),
			() => Ember.RSVP.resolve('fifth error'),
			() => Ember.RSVP.resolve('sixth error'),
		];

		const validators3 = [
			() => Ember.RSVP.resolve('seventh error'),
			() => Ember.RSVP.resolve('eighth error'),
			() => Ember.RSVP.resolve('ninth error'),
		];

		const validationFn = and(
			and(
				and(...validators1),
				and(...validators2)
			),
			and(...validators3)
		);

		assert.equal(await validationFn(), 'first error');
	}

	{
		const validators1 = [
			() => Ember.RSVP.resolve(true),
			() => Ember.RSVP.resolve(true),
			() => Ember.RSVP.resolve(true),
		];

		const validators2 = [
			() => Ember.RSVP.resolve(true),
			() => Ember.RSVP.resolve('leeroy jenkins'),
			() => Ember.RSVP.resolve(true),
		];

		const validators3 = [
			() => Ember.RSVP.resolve(true),
			() => Ember.RSVP.resolve(true),
			() => Ember.RSVP.resolve(true),
		];

		const validationFn = and(
			and(
				and(...validators1),
				and(...validators2)
			),
			and(...validators3)
		);

		assert.equal(await validationFn(), 'leeroy jenkins');
	}
});
