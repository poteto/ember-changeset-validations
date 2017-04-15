import { module, test } from 'qunit';
import and from 'ember-changeset-validations/validators/and';
import Ember from 'ember';

const {
  RSVP: { resolve, reject }
} = Ember;

module('Unit | Validator | and | async validators');

const testCases = [
  {
    validators: [() => resolve(true), () => resolve(true), () => resolve(true)],
    expected: true
  },
  {
    validators: [() => resolve(true), () => true, () => resolve(true)],
    expected: true
  },
  {
    validators: [() => resolve(true), () => true, () => reject('rip')],
    expected: 'rip'
  }
];

for (const { validators, expected } of testCases) {
  test('it works', async function(assert) {
    const validationFn = and(...validators);
    const result = await validationFn();
    assert.equal(result, expected);
  });
}

test('it short-circuits', async function(assert) {
	const didExecute = [false, false];
  const validators = [
    () => resolve().then(() => { didExecute[0] = true; return undefined; }),
    () => resolve().then(() => { throw new Error('This validator should not be reached.'); })
  ];
	const validationFn = and(...validators);
	await validationFn();
	assert.deepEqual(didExecute, [true, false]);
});

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
    () => resolve(true),
  ];

  const validators2 = [
    () => resolve(true),
    () => resolve('leeroy jenkins'),
    () => resolve(true),
  ];

  const validators3 = [
    () => resolve(true),
    () => resolve(true),
    () => resolve(true),
  ];

  const validationFn = and(
    and(
      and(...validators1),
      and(...validators2)
    ),
    and(...validators3)
  );

  const result = await validationFn();
  assert.equal(await validationFn(), 'leeroy jenkins');
});
