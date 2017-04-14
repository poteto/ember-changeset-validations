import { module, test } from 'qunit';
import or from 'ember-changeset-validations/validators/or';
import Ember from 'ember';

module('Unit | Validator | or | sync validators');

/**
 * @param {Number} ms
 */
function resolveAfter(ms) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    try {
      Ember.run.later(resolve, true, ms)
    } catch (err) {
      reject(err)
    }
  })
}

/**
 * Note: ember-changeset treats anything that isn't the
 * value `true` as a failed alidation.
 *
 * @param {Number} ms
 * @param {String} errorMessage
 */
function rejectAfter(ms, errorMessage) {
  return new Ember.RSVP.Promise((resolve, reject) => {
    try {
      Ember.run.later(resolve, errorMessage, ms)
    } catch (err) {
      reject(err)
    }
  })
}

test('should work with an argument list', async function(assert) {
	const testCases = [
		{
			validators: [
				() => rejectAfter(1, 'first'),
				() => rejectAfter(2, 'second'),
				() => rejectAfter(3, 'third')
			],
			expected: 'third',
		},
		{
			validators: [() => rejectAfter(1), () => true, () => rejectAfter(3)],
			expected: true,
		},
		{
			validators: [() => true, () => resolveAfter(3, 'rip')],
			expected: true,
		},
	]

	for (const { validators, expected } of testCases) {
		const validationFn = or(...validators)
		const result = await validationFn()
		assert.equal(result, expected)
	}
})

test('should short-circuit', async function(assert) {
	const didExecute = [false, false, false]
	const validators = [
		() => rejectAfter(1, 'first').then(() => { didExecute[0] = true; return false }),
		() => rejectAfter(1, 'second').then(() => true),
		() => rejectAfter(1, 'third').then(() => { throw new Error('This validator should not be reached.') }),
	]
	const validationFn = or(...validators)
	await validationFn()
	assert.deepEqual(didExecute, [true, false, false])
})

test('should return the last error if all validators return errors', async function(assert) {
	const validators = [
		() => Ember.RSVP.resolve('first error'),
		() => Ember.RSVP.resolve('second error'),
		() => Ember.RSVP.resolve('third error'),
	]

	const validationFn = or(...validators)
	assert.deepEqual(await validationFn(), 'third error')
})

test('should work with arbitrary nesting', async function(assert) {
	{
		const validators1 = [
			() => Ember.RSVP.resolve('first error'),
			() => Ember.RSVP.resolve('second error'),
			() => Ember.RSVP.resolve('third error'),
		]

		const validators2 = [
			() => Ember.RSVP.resolve('fourth error'),
			() => Ember.RSVP.resolve('fifth error'),
			() => Ember.RSVP.resolve('sixth error'),
		]

		const validators3 = [
			() => Ember.RSVP.resolve('seventh error'),
			() => Ember.RSVP.resolve('eighth error'),
			() => Ember.RSVP.resolve('ninth error'),
		]

		const validationFn = or(
			or(
				or(...validators1),
				or(...validators2)
			),
			or(...validators3)
		)

		assert.equal(await validationFn(), 'ninth error')
	}

	{
		const validators1 = [
			() => Ember.RSVP.resolve('first error'),
			() => Ember.RSVP.resolve('second error'),
			() => Ember.RSVP.resolve('third error'),
		]

		const validators2 = [
			() => Ember.RSVP.resolve('fourth error'),
			() => Ember.RSVP.resolve(true), // derp
			() => Ember.RSVP.resolve('sixth error'),
		]

		const validators3 = [
			() => Ember.RSVP.resolve('seventh error'),
			() => Ember.RSVP.resolve('eighth error'),
			() => Ember.RSVP.resolve('ninth error'),
		]

		const validationFn = or(
			or(
				or(...validators1),
				or(...validators2)
			),
			or(...validators3)
		)

		assert.equal(await validationFn(), true)
	}
})
