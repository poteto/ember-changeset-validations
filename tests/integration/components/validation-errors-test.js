import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('foo-bar', 'Integration | Components | validation errors', {
  integration: true
});

test('will clear error messages independently by field', function(assert) {
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

  assert.equal(this.$('ul.firstNameErrors').length, 0);
  assert.equal(this.$('ul.lastNameErrors').length, 0);

  Ember.run(() => {
    this.$('input.firstName').val('a').trigger('input');
    this.$('input.lastName').val('b').trigger('input');
  });

  assert.equal(this.$('ul.firstNameErrors li').length, 1);
  assert.equal(this.$('ul.lastNameErrors li').length, 1);

  Ember.run(() => {
    this.$('input.lastName').val('bc').trigger('input');
  });

  assert.equal(this.$('ul.firstNameErrors li').length, 1);
  assert.equal(this.$('ul.lastNameErrors').length, 0);
});
