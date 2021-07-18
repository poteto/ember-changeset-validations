import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, find, fillIn, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | address-book', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    this.model = {};
    this.onSave = function () {
      assert.step('save called');
      return Promise.resolve();
    };
    await render(
      hbs`<AddressBook @onSave={{this.onSave}} @model={{this.model}} />`
    );

    await fillIn('#address-book-name', 'abcdef');
    assert.equal(find('#address-book-name').value, 'abcdef');

    await fillIn('#address-book-name', '');
    assert.equal(find('#address-book-name').value, '');

    await fillIn('#address-book-name', 'abcdef');
    assert.equal(find('#address-book-name').value, 'abcdef');

    await click('[data-test-submit]');
    assert.equal(find('#address-book-name').value, 'abcdef');

    assert.verifySteps(['save called']);
  });
});
