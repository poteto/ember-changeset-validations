# ember-changeset-validations [![Build Status](https://travis-ci.org/poteto/ember-changeset-validations.svg?branch=master)](https://travis-ci.org/poteto/ember-changeset-validations) [![npm version](https://badge.fury.io/js/ember-changeset-validations.svg)](https://badge.fury.io/js/ember-changeset-validations) [![Ember Observer Score](http://emberobserver.com/badges/ember-changeset-validations.svg)](http://emberobserver.com/addons/ember-changeset-validations)

`ember-changeset-validations` is a companion validation library to [`ember-changeset`](https://github.com/poteto/ember-changeset). It's really simple to use and understand, and there are no CPs or observers anywhere – it's mostly just functions.

Since `ember-changeset` is required to use this addon, please see [documentation](https://github.com/poteto/ember-changeset/blob/master/README.md) there on how to use changesets.

To install:

```
ember install ember-changeset-validations
```

This will also install `ember-changeset`.

## Usage

This addon updates the `changeset` helper by taking in a Validation object as a 2nd argument (instead of a validator function). This means that you can very easily compose validations and decouple the validation from the underlying model.

```hbs
{{! application/template.hbs}}
{{dummy-form
    changeset=(changeset user employeeValidations)
    submit=(action "submit")
    rollback=(action "rollback")
}}

{{dummy-form
    changeset=(changeset user adminValidations)
    submit=(action "submit")
    rollback=(action "rollback")
}}
```

A Validation object is just a POJO. Use the bundled validators from `ember-changeset-validations` to compose validations or write your own. For example:

```js
// validations/employee.js
import { validatePresence, validateLength } from 'ember-changeset-validations/validators';
import validateCustom from '../validators/custom'; // local validator

export default {
  firstName: [
    validatePresence(true),
    validateLength({ min: 4 })
  ],
  lastName: validatePresence(true),
  age: validateCustom({ foo: 'bar' })
};
```

Then, you can use the POJO as a property on your Component or Controller and use it in the template:

```js
import Ember from 'ember';
import employeeValidations from '../validations/employee';
import adminValidations from '../validations/admin';

const { Component } = Ember;

export default Component.extend({
  employeeValidations,
  adminValidations
});
```

```hbs
{{dummy-form
    changeset=(changeset user employeeValidations)
    submit=(action "submit")
    rollback=(action "rollback")
}}
```

## Validator API

#### `presence`

Validates presence/absence of a value.

```js
{
  propertyName: validatePresence(true), // must be present
  propertyName: validatePresence(false) // must be blank
}
```

**[⬆️ back to top](#validator-api)**

#### `length`

Validates the length of a `String` or an `Array`.

```js
{
  propertyName: validateLength({ min: 1 }), // 1 or more
  propertyName: validateLength({ max: 8 }), // up to 8
  propertyName: validateLength({ min: 1, max: 8 }), // between 1 and 8 (inclusive)
  propertyName: validateLength({ is: 16 }), // exactly 16
  propertyName: validateLength({ allowBlank: true }), // can be blank
}
```

**[⬆️ back to top](#validator-api)**

#### `number`

Validates various properties of a number.

```js
{
  propertyName: validateNumber({ is: 16 }), // exactly 16
  propertyName: validateNumber({ allowBlank: true }), // can be blank
  propertyName: validateNumber({ integer: true }), // must be an integer
  propertyName: validateNumber({ lt: 10 }), // less than 10
  propertyName: validateNumber({ lte: 10 }), // less than or equal to 10
  propertyName: validateNumber({ gt: 5 }), // greater than 5
  propertyName: validateNumber({ gte: 10 }), // greater than or equal to 5
  propertyName: validateNumber({ positive: true }), // must be a positive number
  propertyName: validateNumber({ odd: true }), // must be an odd number
  propertyName: validateNumber({ even: true }), // must be an even number
}
```

**[⬆️ back to top](#validator-api)**

#### TODO

- [x] Presence
- [x] Length
- [x] Number
- [ ] Format
- [ ] Inclusion
- [ ] Exclusion

## Writing your own validators

Adding your own validator is super simple – there are no Base classes to extend! **Validators are just functions**. All you need to do is to create a function with the correct signature.

`ember-changeset-validations` expects a function that returns the validator function. The validator (or inner function) accepts a `key`, `newValue` and `oldValue`. The outer function accepts options for the validator.

For example:

```js
// validators/custom.js
export default function validateCustom({ min, max } = {}) {
  return (key, newValue, oldValue) => {
    // validation logic
    // return `true` if valid || error message string if invalid
  }
}
```

That's it! Then, you can use your custom validator like so:

```js
// validations/custom.js
import validateCustom from '../validators/custom';

export default {
  firstName: validateCustom({ min: 4, max: 8 }),
  lastName: validateCustom({ min: 1 })
};
```

## Custom validation messages

This is not yet supported, but is very high on the roadmap.

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
