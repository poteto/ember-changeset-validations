import { find, fillIn } from 'ember-native-dom-helpers';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Components | validation errors', {
  integration: true
});

test('will clear error messages independently by field', async function(assert) {
  this.render(hbs`
    {{#foo-bar as |changeset|}}
      <input class="firstName" value={{changeset.firstName}} oninput={{action (mut changeset.firstName) value="target.value"}}>
      {{#if changeset.error.firstName}}
      <ul class="firstNameErrors">
      {{#each changeset.error.firstName.validation as |message|}}
        <li>{{message}}</li>
      {{/each}}
      </ul>
      {{/if}}

      <input class="lastName" value={{changeset.lastName}} oninput={{action (mut changeset.lastName) value="target.value"}}>
      {{#if changeset.error.lastName}}
      <ul class="lastNameErrors">
      {{#each changeset.error.lastName.validation as |message|}}
        <li>{{message}}</li>
      {{/each}}
      </ul>
      {{/if}}
    {{/foo-bar}}
  `);

  assert.notOk(find('ul.firstNameErrors'));
  assert.notOk(find('ul.lastNameErrors'));

  await fillIn('input.firstName', 'a');
  await fillIn('input.lastName', 'b');

  assert.ok(find('ul.firstNameErrors li'));
  assert.ok(find('ul.lastNameErrors li'));

  await fillIn('input.lastName', 'bc');

  assert.ok(find('ul.firstNameErrors li'));
  assert.notOk(find('ul.lastNameErrors'));
});
