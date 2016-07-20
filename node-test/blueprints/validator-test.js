'use strict';

var blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
var setupTestHooks = blueprintHelpers.setupTestHooks;
var emberNew = blueprintHelpers.emberNew;
var emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

var expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy validator', function() {
  setupTestHooks(this);

  it('generates and destroys a validator', function() {
    var args = ['validator', 'is-positive'];

    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        expect(file('app/validators/is-positive.js'))
          .to.contain('export default function validateIsPositive(/* options = {} */) {\n');
        expect(file('tests/unit/validators/is-positive-test.js'))
          .to.contain("import validateIsPositive from 'my-app/validators/is-positive';")
          .to.contain("module('Unit | Validator | is-positive');")
          .to.contain('assert.ok(validateIsPositive());');
    }));
  });
});
