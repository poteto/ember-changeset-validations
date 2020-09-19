import _Messages from 'ember-validators/messages';
import { assign } from '@ember/polyfills';
import { capitalize, dasherize } from '@ember/string';

const Messages = assign({}, _Messages);

export default assign(Messages, {
  // Blank and present are flipped in ember-validators. Need to flip them back here
  blank: _Messages.present,
  present: _Messages.blank,

  getDescriptionFor(key = '') {
    return capitalize(dasherize(key).split(/[._-]/g).join(' '));
  }
});
