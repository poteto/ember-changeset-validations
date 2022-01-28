<h1 align="center"><br><br><img alt="ember-changeset-validations: Validations for ember-changeset" src="assets/title.svg" width="350px"><br><br><br></h1>

[![Download count all time](https://img.shields.io/npm/dt/ember-changeset-validations.svg)](https://badge.fury.io/js/ember-changeset-validations)
[![GitHub Actions Build Status](https://img.shields.io/github/workflow/status/poteto/ember-changeset-validations/CI/master)](https://github.com/poteto/ember-changeset-validations/actions/workflows/ci.yml?query=branch%3Amaster)
[![npm version](https://badge.fury.io/js/ember-changeset-validations.svg)](https://badge.fury.io/js/ember-changeset-validations)
[![Ember Observer Score](https://emberobserver.com/badges/ember-changeset-validations.svg)](https://emberobserver.com/addons/ember-changeset-validations)

`ember-changeset-validations` is a companion validation library to [`ember-changeset`](https://github.com/poteto/ember-changeset). It's really simple to use and understand, and there are no CPs or observers anywhere – it's mostly just functions.

Since `ember-changeset` is required to use this addon, please see [documentation](https://github.com/poteto/ember-changeset/blob/master/README.md) there on how to install and use changesets.

To install if your app is on ember-source >= 3.13:

```
ember install ember-changeset-validations
```

To install if your app is on ember-source < 3.13:

```
ember install ember-changeset-validations@v2.2.1
```

Starting with v4 this addon does not install `ember-changeset` so make sure to list it in your devDependencies (for apps) or dependencies (for addons).

Watch [a 6-part video series on ember-changeset and ember-changeset-validations](https://www.emberscreencasts.com/tags/editing-and-validating-forms-with-ember-changeset) presented by EmberScreencasts.

## Usage

This addon updates the `changeset` helper by taking in a validation map as a 2nd argument (instead of a validator function). This means that you can very easily compose validations and decouple the validation from the underlying model.

```hbs
{{! application/template.hbs}}
<DummyForm
    @changeset={{changeset user EmployeeValidations}}
    @submit={{action "submit"}}
    @rollback={{action "rollback"}} />

<DummyForm
    @changeset={{changeset user AdminValidations}}
    @submit={{action "submit"}}
    @rollback={{action "rollback"}} />
```

A validation map is just a POJO (Plain Old JavaScript Object). Use the bundled validators from `ember-changeset-validations` to compose validations or write your own. For example:

```js
// validations/employee.js
import {
  validatePresence,
  validateLength,
  validateConfirmation,
  validateFormat
} from 'ember-changeset-validations/validators';
import validateCustom from '../validators/custom'; // local validator
import validatePasswordStrength from '../validators/password-strength'; // local validator

export default {
  firstName: [
    validatePresence(true),
    validateLength({ min: 4 })
  ],
  lastName: validatePresence(true),
  age: validateCustom({ foo: 'bar' }),
  email: validateFormat({ type: 'email' }),
  password: [
    validateLength({ min: 8 }),
    validatePasswordStrength({ minScore: 80 })
  ],
  passwordConfirmation: validateConfirmation({ on: 'password' })
};
```

Then, you can use the POJO as a property on your Component or Controller and use it in the template:

```js
import Component from '@glimmer/component';
import EmployeeValidations from '../validations/employee';
import AdminValidations from '../validations/admin';

export default class EmployeeComponent extends Component {
  EmployeeValidations = EmployeeValidations;
  AdminValidations = AdminValidations;
}
```

```hbs
<DummyForm
    @changeset={{changeset user this.EmployeeValidations}}
    @submit={{action "submit"}}
    @rollback={{action "rollback"}} />
```

Moreover, as of 3.8.0, a validator can be an Object or Class with a `validate` function.

```js
import fetch from 'fetch';

export default class PersonalNoValidator {

  async validate(key, newValue, oldValue, changes, content) {
    try {
      await fetch(
        '/api/personal-no/validation',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: newValue })
        }
      );

      return true;
    } catch (_) {
      return 'Personal No is invalid';
    }
  }
}
```

When creating the `Changeset` programmatically instead of using the `changeset` helper, you will have to apply the `lookupValidator` function to convert the POJO to a validator function as expected by `Changeset`:

```js
import Component from '@glimmer/component';
import EmployeeValidations from '../validations/employee';
import lookupValidator from 'ember-changeset-validations';
import Changeset from 'ember-changeset';

export default class ChangesetComponent extends Component {
  constructor() {
    super(...arguments);
    this.changeset = new Changeset(this.model, lookupValidator(EmployeeValidations), EmployeeValidations);
  }
}
```

```hbs
<DummyForm
    @changeset={{this.changeset}}
    @submit={{action "submit"}}
    @rollback={{action "rollback"}} />
```

`ember-changeset` and `ember-changeset-validations` both also support creating changesets from promises. However, because that will also return a promise, to render in your template you will need to use a helper like `await` from [`ember-promise-helpers`](https://github.com/fivetanley/ember-promise-helpers).

## Validator API

`ember-changeset-validations` utilizes [`ember-validators`](https://github.com/offirgolan/ember-validators) as a core set of validators.

All validators take a [custom message option](#custom-validation-messages).

#### `presence`

Validates presence/absence of a value.

👉 [All Options](https://offirgolan.github.io/ember-validators/docs/classes/Presence.html#method_validate)

```js
{
  propertyName: validatePresence(true), // must be present
  propertyName: validatePresence(false) // must be blank
  propertyName: validatePresence({ presence: true }) // alternative option syntax
  propertyName: validatePresence({ presence: true, ignoreBlank: true }) // If ignoreBlank true, treats an empty or whitespace string as not present.
}
```

#### `on` option for `presence`

Only validates for presence if any of the other values are present
```js
{
  password: validatePresence({ presence: true, on: 'ssn' })
  password: validatePresence({ presence: true, on: [ 'ssn', 'email', 'address' ] })
  password: validatePresence({ presence: false, on: 'alternative-login' })
}
```

**[⬆️ back to top](#validator-api)**

#### `length`

Validates the length of a `String` or an `Array`.

👉 [All Options](https://offirgolan.github.io/ember-validators/docs/classes/Length.html#method_validate)

```js
{
  propertyName: validateLength({ min: 1 }), // 1 or more
  propertyName: validateLength({ max: 8 }), // up to 8
  propertyName: validateLength({ min: 1, max: 8 }), // between 1 and 8 (inclusive)
  propertyName: validateLength({ is: 16 }), // exactly 16
  propertyName: validateLength({ allowBlank: true }) // can be blank
}
```

**[⬆️ back to top](#validator-api)**

#### `date`

This API accepts valid Date objects or a Date in milliseconds since Jan 1 1970, or a functiom that returns a Date.  Strings are currently not supported.  It is recommended you use use native JavaScript or you library of choice to generate a date from your data.

```js
{
  propertyName: validateDate({ before: new Date('3000-01-01') }), // must be before 1st Jan. 3000
  propertyName: validateDate({ onOrBefore: Date.parse(new Date('3000-01-01')) }), // must be not after 1st Jan. 3000
  propertyName: validateDate({ after: new Date('3000-01-01') }), // must be after 1st Jan. 3000
  propertyName: validateDate({ onOrAfter: new Date('3000-01-01') }), // must be not before 1st Jan. 3000
  propertyName: validateDate({ onOrAfter: () => new Date() }), // must not be in the past
  propertyName: validateDate({ onOrAfter: '3000-01-01' }), // Error
}
```

**[⬆️ back to top](#validator-api)**

#### `number`

Validates various properties of a number.

👉 [All Options](https://offirgolan.github.io/ember-validators/docs/classes/Number.html#method_validate)

```js
{
  propertyName: validateNumber({ is: 16 }), // exactly 16
  propertyName: validateNumber({ allowBlank: true }), // can be blank
  propertyName: validateNumber({ integer: true }), // must be an integer
  propertyName: validateNumber({ lt: 10 }), // less than 10
  propertyName: validateNumber({ lte: 10 }), // less than or equal to 10
  propertyName: validateNumber({ gt: 5 }), // greater than 5
  propertyName: validateNumber({ gte: 10 }), // greater than or equal to 10
  propertyName: validateNumber({ positive: true }), // must be a positive number
  propertyName: validateNumber({ odd: true }), // must be an odd number
  propertyName: validateNumber({ even: true }), // must be an even number
  propertyName: validateNumber({ multipleOf: 7 }) // must be a multiple of 7
}
```

**[⬆️ back to top](#validator-api)**

#### `inclusion`

Validates that a value is a member of some list or range.

👉 [All Options](https://offirgolan.github.io/ember-validators/docs/classes/Inclusion.html#method_validate)

```js
{
  propertyName: validateInclusion({ list: ['Foo', 'Bar'] }), // must be "Foo" or "Bar"
  propertyName: validateInclusion({ range: [18, 60] }), // must be between 18 and 60
  propertyName: validateInclusion({ allowBlank: true }), // can be blank
}
```

**[⬆️ back to top](#validator-api)**

#### `exclusion`

Validates that a value is a not member of some list or range.

👉 [All Options](https://offirgolan.github.io/ember-validators/docs/classes/Exclusion.html#method_validate)

```js
{
  propertyName: validateExclusion({ list: ['Foo', 'Bar'] }), // cannot be "Foo" or "Bar"
  propertyName: validateExclusion({ range: [18, 60] }), // must not be between 18 and 60
  propertyName: validateExclusion({ allowBlank: true }), // can be blank
}
```

**[⬆️ back to top](#validator-api)**

#### `format`

Validates a `String` based on a regular expression.

👉 [All Options](https://offirgolan.github.io/ember-validators/docs/classes/Format.html#method_validate)

```js
{
  propertyName: validateFormat({ allowBlank: true }), // can be blank
  propertyName: validateFormat({ type: 'email' }), // built-in email format
  propertyName: validateFormat({ type: 'phone' }), // built-in phone format
  propertyName: validateFormat({ type: 'url' }), // built-in URL format
  propertyName: validateFormat({ regex: /\w{6,30}/ }) // custom regular expression
  propertyName: validateFormat({ type: 'email', inverse: true }) // passes if the value doesn't match the given format
}
```

**[⬆️ back to top](#validator-api)**

#### `confirmation`

Validates that a field has the same value as another.

👉 [All Options](https://offirgolan.github.io/ember-validators/docs/classes/Confirmation.html#method_validate)

```js
{
  propertyName: validateConfirmation({ on: 'password' }), // must match 'password'
  propertyName: validateConfirmation({ allowBlank: true }), // can be blank
}
```

**[⬆️ back to top](#validator-api)**

## Writing your own validators

Adding your own validator is super simple – there are no Base classes to extend! **Validators are just functions**. All you need to do is to create a function with the correct signature.

Create a new validator using the blueprint:

```
ember generate validator <name>
```

`ember-changeset-validations` expects a higher order function that returns the validator function. The validator (or inner function) accepts a `key`, `newValue`, `oldValue`, `changes`, and `content`. The outer function accepts options for the validator.

### Synchronous validators

For example:

```js
// validators/custom.js
export default function validateCustom({ min, max } = {}) {
  return (key, newValue, oldValue, changes, content) => {
    // validation logic
    // return `true` if valid || error message string if invalid
  }
}
```

### Asynchronous validators

In addition to conforming to the function signature above, your validator function should return a Promise that resolves with `true` (if valid), or an error message string if invalid.

For example:

```js
export default function validateUniqueness(opts) {
  return (key, newValue, oldValue, changes, content) => {
    return new Promise((resolve) => {
      // validation logic
      // resolve with `true` if valid || error message string if invalid
      resolve(true);
    });
  };
}
```

### Using custom validators

That's it! Then, you can use your custom validator like so:

```js
// validations/custom.js
import { validateLength } from 'ember-changeset-validations/validators';
import validateUniqueness from '../validators/unique';
import validateCustom from '../validators/custom';

export default {
  firstName: validateCustom({ min: 4, max: 8 }),
  lastName: validateCustom({ min: 1 }),
  email: [
    validateFormat({ type: 'email'}),
    validateUniqueness()
  ]
};
```

### Testing

Since validators are higher order functions that return functions, testing is straightforward and requires no additional setup:

```js
import validateUniqueness from 'path/to/validators/uniqueness';
import { module, test } from 'qunit';

module('Unit | Validator | uniqueness');

test('it does something', function(assert) {
  let key = 'email';
  let options = { /* ... */ };
  let validator = validateUniqueness(options);

  assert.equal(validator(key, undefined), /* ... */);
  assert.equal(validator(key, null), /* ... */);
  assert.equal(validator(key, ''), /* ... */);
  assert.equal(validator(key, 'foo@bar.com'), /* ... */);
});
```

## Validation composition

Because validation maps are POJOs, composing them couldn't be simpler:

```js
// validations/user.js
import {
  validatePresence,
  validateLength
} from 'ember-changeset-validations/validators';

export default {
  firstName: validatePresence(true),
  lastName: validatePresence(true)
};
```

You can easily import other validations and combine them using `Object.assign`.

```js
// validations/adult.js
import UserValidations from './user';
import { validateNumber } from 'ember-changeset-validations/validators';

export const AdultValidations = {
  age: validateNumber({ gt: 18 })
};

export default Object.assign({}, UserValidations, AdultValidations);
```

## Custom validation messages

Each validator that is a part of this library can utilize a `message` property on the `options` object passed to the validator. That `message` property can either be a string or a function.

If `message` is a string, you can put particular placeholders into it that will be automatically replaced. For example:

```js
{
  propertyName: validatePresence({ presence: true, message: '{description} should be present' })
}
```

`{description}` is a hardcoded placeholder that will be replaced with a normalized version of the property name being validated. Any other placeholder will map to properties of the `options` object you pass to the validator.

Message can also accept a function with the signature `(key, type, value, context)`. Key is the property name being validated. Type is the type of validation being performed (in the case of validators such as `number` or `length`, there can be a couple of different ones.) Value is the actual value being validated. Context maps to the `options` object you passed to the validator.

If `message` is a function, it must return the error message as a string.

## Overriding validation messages

If you need to be able to override the entire validation message object, simply create a module at `app/validations/messages.js`, exporting a POJO with the following keys:

```js
// app/validations/messages.js
export default {
  inclusion: // '{description} is not included in the list',
  exclusion: // '{description} is reserved',
  invalid: // '{description} is invalid',
  confirmation: // "{description} doesn't match {on}",
  accepted: // '{description} must be accepted',
  empty: // "{description} can't be empty",
  blank: // '{description} must be blank',
  present: // "{description} can't be blank",
  collection: // '{description} must be a collection',
  singular: // "{description} can't be a collection",
  tooLong: // '{description} is too long (maximum is {max} characters)',
  tooShort: // '{description} is too short (minimum is {min} characters)',
  between: // '{description} must be between {min} and {max} characters',
  before: // '{description} must be before {before}',
  onOrBefore: // '{description} must be on or before {onOrBefore}',
  after: // '{description} must be after {after}',
  onOrAfter: // '{description} must be on or after {onOrAfter}',
  wrongDateFormat: // '{description} must be in the format of {format}',
  wrongLength: // '{description} is the wrong length (should be {is} characters)',
  notANumber: // '{description} must be a number',
  notAnInteger: // '{description} must be an integer',
  greaterThan: // '{description} must be greater than {gt}',
  greaterThanOrEqualTo: // '{description} must be greater than or equal to {gte}',
  equalTo: // '{description} must be equal to {is}',
  lessThan: // '{description} must be less than {lt}',
  lessThanOrEqualTo: // '{description} must be less than or equal to {lte}',
  otherThan: // '{description} must be other than {value}',
  odd: // '{description} must be odd',
  even: // '{description} must be even',
  positive: // '{description} must be positive',
  multipleOf: // '{description} must be a multiple of {multipleOf}',
  date: // '{description} must be a valid date',
  email: // '{description} must be a valid email address',
  phone: // '{description} must be a valid phone number',
  url: // '{description} must be a valid url'
}
```

In the message body, any text wrapped in single braces will be replaced with their appropriate values that were passed in as options to the validator. For example:

```js
import buildMessage from 'ember-changeset-validations/utils/validation-errors';
// validators/custom.js
export default function validateIsOne(options) {
  return (key, newValue, oldValue, changes, content) => {
    return newValue === 1 || buildMessage(key, { type: 'isOne', value: newValue, context: options });
  }
}
```

```js
// validations/foo.js
export default {
  mySpecialNumber: validateIsOne({ foo: 'foo' }})
};
```

The above will look for a key `isOne` in your custom validation map, and use keys defined on the options object (in this case, `foo`) to replace tokens. With the custom validator above, we can add:

```js
// app/validations/messages.js
export default {
  isOne: '{description} must equal one, and also {foo}'
}
```

Will render: `My special number must equal one, and also foo`.

## Raw error output

By default, `ember-changeset-validations` returns the errors as plain strings.
In some situations, it may be preferable for the developer that the library returns a description of the errors;
internationalisation (i18n) for example, or finer-grained error output.

To have `ember-changeset-validations` return such data structure, add the following to you `config/environment.js`

```
let ENV = {
  ...
  'changeset-validations': { rawOutput: true }
  ...
}
```

This will return an object with the following structure, that you can then pass to your applications's error processing:

```
{
  value, // the value to validate
  type, // the type of the error (`present`, `blank`...)
  message, // the **unprocessed** error message
  context: {
    description // the description of the field
    // ...and other options given to configure the validator
  }
}
```

## Contributors

We're grateful to these wonderful contributors who've contributed to `ember-changeset-validations`:

[//]: contributor-faces
<a href="https://github.com/poteto"><img src="https://avatars0.githubusercontent.com/u/1390709?v=4" title="poteto" width="80" height="80"></a>
<a href="https://github.com/snewcomer"><img src="https://avatars0.githubusercontent.com/u/7374640?v=4" title="snewcomer" width="80" height="80"></a>
<a href="https://github.com/nucleartide"><img src="https://avatars3.githubusercontent.com/u/914228?v=4" title="nucleartide" width="80" height="80"></a>
<a href="https://github.com/acburdine"><img src="https://avatars2.githubusercontent.com/u/5167581?v=4" title="acburdine" width="80" height="80"></a>
<a href="https://github.com/rkrishnan8594"><img src="https://avatars1.githubusercontent.com/u/5016823?v=4" title="rkrishnan8594" width="80" height="80"></a>
<a href="https://github.com/ahmadsoe"><img src="https://avatars3.githubusercontent.com/u/1957737?v=4" title="ahmadsoe" width="80" height="80"></a>
<a href="https://github.com/martndemus"><img src="https://avatars2.githubusercontent.com/u/903637?v=4" title="martndemus" width="80" height="80"></a>
<a href="https://github.com/brandynbennett"><img src="https://avatars0.githubusercontent.com/u/4146629?v=4" title="brandynbennett" width="80" height="80"></a>
<a href="https://github.com/bcardarella"><img src="https://avatars0.githubusercontent.com/u/18524?v=4" title="bcardarella" width="80" height="80"></a>
<a href="https://github.com/Dhaulagiri"><img src="https://avatars1.githubusercontent.com/u/1672302?v=4" title="Dhaulagiri" width="80" height="80"></a>
<a href="https://github.com/noslouch"><img src="https://avatars1.githubusercontent.com/u/2090382?v=4" title="noslouch" width="80" height="80"></a>
<a href="https://github.com/pangratz"><img src="https://avatars1.githubusercontent.com/u/341877?v=4" title="pangratz" width="80" height="80"></a>
<a href="https://github.com/Daniel-Xu"><img src="https://avatars0.githubusercontent.com/u/548144?v=4" title="Daniel-Xu" width="80" height="80"></a>
<a href="https://github.com/dustinfarris"><img src="https://avatars3.githubusercontent.com/u/1087165?v=4" title="dustinfarris" width="80" height="80"></a>
<a href="https://github.com/jeffreybiles"><img src="https://avatars2.githubusercontent.com/u/839123?v=4" title="jeffreybiles" width="80" height="80"></a>
<a href="https://github.com/jhitchins88"><img src="https://avatars2.githubusercontent.com/u/24356857?v=4" title="jhitchins88" width="80" height="80"></a>
<a href="https://github.com/manquer"><img src="https://avatars3.githubusercontent.com/u/3044333?v=4" title="manquer" width="80" height="80"></a>
<a href="https://github.com/michaellee"><img src="https://avatars1.githubusercontent.com/u/1329644?v=4" title="michaellee" width="80" height="80"></a>
<a href="https://github.com/cibernox"><img src="https://avatars2.githubusercontent.com/u/265339?v=4" title="cibernox" width="80" height="80"></a>
<a href="https://github.com/nickschot"><img src="https://avatars1.githubusercontent.com/u/334789?v=4" title="nickschot" width="80" height="80"></a>
<a href="https://github.com/offirgolan"><img src="https://avatars2.githubusercontent.com/u/575938?v=4" title="offirgolan" width="80" height="80"></a>
<a href="https://github.com/patrickberkeley"><img src="https://avatars0.githubusercontent.com/u/8364?v=4" title="patrickberkeley" width="80" height="80"></a>
<a href="https://github.com/scottkidder"><img src="https://avatars1.githubusercontent.com/u/136984?v=4" title="scottkidder" width="80" height="80"></a>
<a href="https://github.com/simonihmig"><img src="https://avatars0.githubusercontent.com/u/1325249?v=4" title="simonihmig" width="80" height="80"></a>
<a href="https://github.com/sivakumar-kailasam"><img src="https://avatars3.githubusercontent.com/u/604117?v=4" title="sivakumar-kailasam" width="80" height="80"></a>
<a href="https://github.com/ssured"><img src="https://avatars3.githubusercontent.com/u/2558804?v=4" title="ssured" width="80" height="80"></a>
<a href="https://github.com/TayHobbs"><img src="https://avatars1.githubusercontent.com/u/6898493?v=4" title="TayHobbs" width="80" height="80"></a>
<a href="https://github.com/exeto"><img src="https://avatars1.githubusercontent.com/u/4079046?v=4" title="exeto" width="80" height="80"></a>

[//]: contributor-faces

## Installation

* `git clone <repository-url>` this repository
* `cd ember-changeset-validations`
* `npm install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
