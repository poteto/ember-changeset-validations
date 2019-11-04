import validatePresence from 'ember-changeset-validations/validators/presence';
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
import { module, test } from 'qunit';

module('Unit | Validator | presence', function() {
  test('it accepts a `true` option', function(assert) {
    let key = 'firstName';
    let validator = validatePresence(true);

    assert.equal(validator(key, undefined), buildMessage(key, { type: 'present' }));
    assert.equal(validator(key, null), buildMessage(key, { type: 'present' }));
    assert.equal(validator(key, ''), buildMessage(key, { type: 'present' }));
    assert.equal(validator(key, 'a'), true);
  });

  test('it accepts a `false` option', function(assert) {
    let key = 'firstName';
    let validator = validatePresence(false);

    assert.equal(validator(key, undefined), true);
    assert.equal(validator(key, null), true);
    assert.equal(validator(key, ''), true);
    assert.equal(validator(key, 'a'), buildMessage(key, { type: 'blank' }));
  });

  test('it accepts a true `presence` option', function(assert) {
    let key = 'firstName';
    let validator = validatePresence({ presence: true });

    assert.equal(validator(key, undefined), buildMessage(key, { type: 'present' }));
    assert.equal(validator(key, null), buildMessage(key, { type: 'present' }));
    assert.equal(validator(key, ''), buildMessage(key, { type: 'present' }));
    assert.equal(validator(key, 'a'), true);
  });

  test('it accepts a false `presence` option', function(assert) {
    let key = 'firstName';
    let validator = validatePresence({ presence: false });

    assert.equal(validator(key, undefined), true);
    assert.equal(validator(key, null), true);
    assert.equal(validator(key, ''), true);
    assert.equal(validator(key, 'a'), buildMessage(key, { type: 'blank' }));
  });

  function presenceOnTests(assert, options) {
    let key = 'firstName';
    let targets = typeof options.on === 'string' ? [ options.on ] : options.on
    let validator = validatePresence(options)
    let expectedIfEmpty = options.presence ? buildMessage(key, { type: 'present' }) : true
    let expectedIfPresent = options.presence ? true : buildMessage(key, { type: 'blank' })

    assert.equal(validator(key, undefined, '', {}, {}), true);
    assert.equal(validator(key, null, '', {}, {}), true);
    assert.equal(validator(key, '', '', {}, {}), true);
    assert.equal(validator(key, 'a', '', {}, {}), true);

    for (let target of targets) {
      assert.equal(validator(key, '', '', {}, { [target]: undefined }), true)
      assert.equal(validator(key, '', '', {}, { [target]: null }), true)
      assert.equal(validator(key, '', '', {}, { [target]: '' }), true)

      assert.equal(validator(key, '', '', { [target]: undefined }, {}), true)
      assert.equal(validator(key, '', '', { [target]: null }, {}), true)
      assert.equal(validator(key, '', '', { [target]: '' }, {}), true)

      assert.equal(validator(key, '', '', { [target]: 'a'}, {}), expectedIfEmpty)
      assert.equal(validator(key, 'a', '', { [target]: 'a'}, {}), expectedIfPresent)

      // if the target is blank on the changes, it ignores the value in the content
      assert.equal(validator(key, '', '', { [target]: ''}, { [target]: 'a' }), true)
      assert.equal(validator(key, 'a', '', { [target]: ''}, { [target]: 'a' }), true)
    }

    let allTargets = {}
    let allBlankTargets = {}

    for (let target of targets) {
      allTargets[target] = 'a'
      allBlankTargets[target] = ''
    }

    assert.equal(validator(key, '', '', allTargets, {}), expectedIfEmpty)
    assert.equal(validator(key, 'a', '', allTargets, {}), expectedIfPresent)
    assert.equal(validator(key, '', '', {}, allTargets), expectedIfEmpty)
    assert.equal(validator(key, 'a', '', {}, allTargets), expectedIfPresent)
    assert.equal(validator(key, '', '', allBlankTargets, allTargets), true)
  }

  test('it accepts a string `on` option and true presence', function(assert) {
    presenceOnTests(assert, { presence: true, on: 'dependent' });
  });

  test('it accepts an array `on` option and true presence', function(assert) {
    presenceOnTests(assert, { presence: true, on: [ 'dependent' ] });
  });

  test('it accepts an multiple string array `on` option and true presence', function(assert) {
    presenceOnTests(assert, { presence: true, on: [ 'dependent1', 'dependent2' ] });
  });

  test('it accepts a string `on` option and false presence', function(assert) {
    presenceOnTests(assert, { presence: false, on: 'dependent' });
  });

  test('it accepts an array `on` option and false presence', function(assert) {
    presenceOnTests(assert, { presence: false, on: [ 'dependent' ] });
  });

  test('it accepts an multiple string array `on` option and false presence', function(assert) {
    presenceOnTests(assert, { presence: false, on: [ 'dependent1', 'dependent2' ] });
  });


  test('it can output a custom message string', function(assert) {
    let key = 'firstName';
    let options = { presence: true, message: '{description} should be present' };
    let validator = validatePresence(options);

    assert.equal(validator(key, ''), 'First name should be present', 'custom message string is generated correctly');
  });

  test('it can output a custom message function', function(assert) {
    assert.expect(5);

    let key = 'firstName';
    let options = {
      presence: false,
      message: function(_key, type, value, context) {
        assert.equal(_key, key);
        assert.equal(type, 'blank');
        assert.equal(value, 'test');
        assert.strictEqual(context.presence, false);

        return 'some test message';
      }
    };
    let validator = validatePresence(options);

    assert.equal(validator(key, 'test'), 'some test message', 'custom message function is returned correctly');
  });
});
