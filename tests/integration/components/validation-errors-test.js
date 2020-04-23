import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find, fillIn, focus, blur } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Components | validation errors', function(hooks) {
  setupRenderingTest(hooks);

  test('will clear error messages independently by field', async function(assert) {
    await render(hbs`
      <FooBar as |changeset|>
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
      </FooBar>
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

  test('will mark a field invalid on focus out if it is required', async function(assert) {
    await render(hbs`
      <FooBar as |changeset|>
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
      </FooBar>
    `);

    assert.notOk(find('ul.firstNameErrors'), 'has no first name errors');
    assert.notOk(find('ul.lastNameErrors'), 'has no last name errors');

    await focus('input.firstName');
    await blur('input.firstName');

    assert.ok(find('ul.firstNameErrors li'), 'has first name errors');
  });

  test('works with nested fields', async function(assert) {
    await render(hbs`
      <FooBar as |changeset|>
        <input
          class="state-ny"
          value={{changeset-get changeset "state.ny"}}
          oninput={{action (changeset-set changeset "state.ny")
          value="target.value"}}>
        {{#if changeset.error.state.ny}}
          <ul class="stateNyErrors">
          {{#each changeset.error.state.ny.validation as |message|}}
            <li>{{message}}</li>
          {{/each}}
          </ul>
        {{/if}}

        <input
          class="state-wi"
          value={{changeset-get changeset "state.wi"}}
          oninput={{action (changeset-set changeset "state.wi")
          value="target.value"}}>
        {{#if changeset.error.state.wi}}
          <ul class="stateWiErrors">
          {{#each changeset.error.state.wi.validation as |message|}}
            <li>{{message}}</li>
          {{/each}}
          </ul>
        {{/if}}
      </FooBar>
    `);

    assert.notOk(find('ul.stateNyErrors'), 'has no ny errors');
    assert.notOk(find('ul.stateWiErrors'), 'has no wi errors');

    await fillIn('input.state-ny', 'a');
    await fillIn('input.state-wi', 'b');

    assert.ok(find('ul.stateNyErrors li'), 'has ny errors');
    assert.ok(find('ul.stateWiErrors li'), 'has wi errors');

    await fillIn('input.state-wi', 'bc');

    assert.ok(find('ul.stateNyErrors li'), 'has ny errors after wi input');
    assert.notOk(find('ul.stateWiErrors'), 'has no wi errors after input');
  });
});
