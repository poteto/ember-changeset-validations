import and from 'ember-changeset-validations/validators/and';
import or from 'ember-changeset-validations/validators/or';
import Ember from 'ember';
import { module, test } from 'qunit';

const {
  RSVP: { resolve, reject }
} = Ember;

module('Unit | Validator | higher-order functions | integration');

test('it works with n-level nesting and arbitrary sync/async combos', async function(assert) {
  let numExecuted = 0;

  const validators1 = [
    () => { numExecuted++; return 'first error'; },
    () => { numExecuted++; return resolve('second error'); },
    () => { numExecuted++; return 'third error'; }
  ];

  const validators2 = [
    () => { numExecuted++; return false; },
    () => { numExecuted++; return 'fifth error'; },
    () => { numExecuted++; return reject('sixth error'); }
  ];

  const validators3 = [
    () => { numExecuted++; return 'seventh error'; },
    () => { numExecuted++; return true; },
    () => { numExecuted++; return 'ninth error'; }
  ];

  const validationFn = and(
    and( // 'first error'
      and(...validators1), // 'first error'
      or(...validators2),
      or(
        or(...validators1),
        and(...validators2)
      )
    ),
    or(...validators3) // true
  );

  const result = await validationFn();
  assert.equal(result, 'first error');
  assert.equal(numExecuted, 1);
});

test('it works with n-level nesting and arbitrary sync/async combos', async function(assert) {
  let numExecuted = 0;

  const validators1 = [
    () => { numExecuted++; return 'first error'; },
    () => { numExecuted++; return resolve('second error'); },
    () => { numExecuted++; return 'third error'; }
  ];

  const validators2 = [
    () => { numExecuted++; return false; },
    () => { numExecuted++; return 'fifth error'; },
    () => { numExecuted++; return reject('sixth error'); }
  ];

  const validators3 = [
    () => { numExecuted++; return 'seventh error'; },
    () => { numExecuted++; return true; },
    () => { numExecuted++; return 'ninth error'; }
  ];

  const validationFn = and(
    or(
      and(...validators1), // +1, 'first error'
      or(...validators2), // +3, 'sixth error'
      or( // false
        or(...validators1), // +3, 'third error'
        and(...validators2), // +1, false
        or( // false
          or(...validators1), // +3, 'third error'
          and(...validators2) // +1, false
        )
      )
    ),
    and(...validators3)
  );

  const result = await validationFn();
  assert.equal(result, false);
  assert.equal(numExecuted, 12);
});
