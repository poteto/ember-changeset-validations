import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Components | validation errors', function(hooks) {
  setupRenderingTest(hooks);

  test('will clear error messages independently by field', async function(assert) {
    await render(hbs`
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

    assert.notOk(find('ul.firstNameErrors'), 'has no first name errors');
    assert.notOk(find('ul.lastNameErrors'), 'has no last name errors');

    await fillIn('input.firstName', 'a');
    await fillIn('input.lastName', 'b');

    assert.ok(find('ul.firstNameErrors li'), 'has first name errors');
    assert.ok(find('ul.lastNameErrors li'), 'has last name errors');

    await fillIn('input.lastName', 'bc');

    assert.ok(find('ul.firstNameErrors li'), 'has first name errors after last name input');
    assert.notOk(find('ul.lastNameErrors'), 'has no last name errors after input');
  });
});
