import { module, test } from 'qunit';
import validate<%= classifiedModuleName %> from '<%= dasherizedPackageName %>/validators/<%= dasherizedModuleName %>';

module('Unit | Validator | <%= dasherizedModuleName %>');

test('it exists', function(assert) {
  assert.ok(validate<%= classifiedModuleName %>());
});
