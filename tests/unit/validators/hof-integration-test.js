import and from 'ember-changeset-validations/validators/and';
import or from 'ember-changeset-validations/validators/or';
import Ember from 'ember';
import { module, test } from 'qunit';

module('Unit | Validator | higher-order functions | integration');

test('it works with n-level nesting and arbitrary sync/async combos', async function(assert) {
	let evaluationCount = 0;

	const validators1 = [
		() => { evaluationCount++; return 'first error'; },
		() => { evaluationCount++; return Ember.RSVP.resolve('second error'); },
		() => { evaluationCount++; return 'third error'; },
	];

	const validators2 = [
		() => { evaluationCount++; return false; },
		() => { evaluationCount++; return 'fifth error'; },
		() => { evaluationCount++; return Ember.RSVP.reject('sixth error'); },
	];

	const validators3 = [
		() => { evaluationCount++; return 'seventh error'; },
		() => { evaluationCount++; return true; },
		() => { evaluationCount++; return 'ninth error'; },
	];

	const validationFn = and(
		and( // 'first error'
			and(...validators1), // 'first error'
			or(...validators2),
			or(
				or(...validators1),
				and(...validators2),
			)
		),
		or(...validators3) // true
	);

	assert.equal(await validationFn(), 'first error');
	assert.equal(evaluationCount, 1);
});
