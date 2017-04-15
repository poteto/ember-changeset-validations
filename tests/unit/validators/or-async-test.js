import { module, test } from 'qunit';
import or from 'ember-changeset-validations/validators/or';
import Ember from 'ember';

const {
  RSVP: { resolve, reject }
} = Ember;

module('Unit | Validator | or | async validators');

const testCases = [
  {
    validators: [() => reject('first'), () => reject('second'), () => reject('third')],
    expected: 'third'
  },
  {
    validators: [() => reject('first'), () => true, () => reject('third')],
    expected: true
  },
  {
    validators: [() => true, () => resolve('rip')],
    expected: true
  },
  {
    validators: [
      () => resolve('first error'),
      () => resolve('second error'),
      () => resolve('third error')
    ],
    expected: 'third error'
  },
  {
    validators: [() => resolve(true), () => resolve('foo')],
    expected: true
  },
  {
    validators: [() => reject(true), () => reject('foo')],
    expected: 'foo'
  }
];

for (const { validators, expected } of testCases) {
  test('it works', async function(assert) {
    const validationFn = or(...validators);
    const result = await validationFn();
    assert.equal(result, expected);
  });
}

test('it short-circuits', async function(assert) {
  const didExecute = [false, false];
  const validators = [
    () => resolve().then(() => { didExecute[0] = true; return true; }),
    () => resolve().then(() => { throw new Error('This validator should not be reached.'); })
  ];
  const validationFn = or(...validators);
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

  const validationFn = or(
    or(
      or(...validators1),
      or(...validators2)
    ),
    or(...validators3)
  );

  const result = await validationFn();
  assert.equal(result, 'ninth error');
});

test('it works with arbitrary nesting', async function(assert) {
  const validators1 = [
    () => resolve('first error'),
    () => resolve('second error'),
    () => resolve('third error')
  ];

  const validators2 = [
    () => resolve('fourth error'),
    () => resolve(true),
    () => resolve('sixth error')
  ];

  const validators3 = [
    () => resolve('seventh error'),
    () => resolve('eighth error'),
    () => resolve('ninth error')
  ];

  const validationFn = or(
    or(
      or(...validators1),
      or(...validators2)
    ),
    or(...validators3)
  );

  const result = await validationFn();
  assert.equal(result, true);
});

test('it passes arguments to validators', async function(assert) {
  const validationFn = or(
    (key, newValue, oldValue, changes, content) => resolve([key, newValue, oldValue, changes, content])
  );
  const result = await validationFn(1, 2, 3, 4, 5);
  assert.deepEqual(result, [1, 2, 3, 4, 5]);
});
