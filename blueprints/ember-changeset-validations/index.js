/* jshint node: true */
'use strict';

module.exports = {
  description: 'Install ember-changeset, a dependency of ember-changeset-validations',
  normalizeEntityName: function() {},
  afterInstall: function() {
    return this.addAddonToProject('ember-changeset', '^1.1.0');
  }
};
