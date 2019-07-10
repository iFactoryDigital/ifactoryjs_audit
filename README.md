# EdenJS - Audit
[![TravisCI](https://travis-ci.com/eden-js/audit.svg?branch=master)](https://travis-ci.com/eden-js/audit)
[![Issues](https://img.shields.io/github/issues/eden-js/audit.svg)](https://github.com/eden-js/audit/issues)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/eden-js/audit)
[![Awesome](https://img.shields.io/badge/awesome-true-green.svg)](https://github.com/eden-js/audit)
[![Discord](https://img.shields.io/discord/583845970433933312.svg)](https://discord.gg/5u3f3up)

Auditing base logic component for [EdenJS](https://github.com/edenjs-cli)

`@edenjs/audit` automatically tracks all model specific actions in the system. By including any model you want to track in config `@edenjs/audit` will track every `update`, `remove`, and `create`, and if possible who/what was changed.

## Setup

### Install

```
npm i --save @edenjs/audit
```

### Configure

```js
config.audit = {
  models : ['user', 'product'], // which models do we want to track
};
```

## Models

### Audit

```js
const Audit = model('audit');
```

Audit model consists of a single tracking item, each instance in the database corresponds to a single `update`, `remove`, or `create` of any tracked model.

## Hooks

### audit.check

```js
this.eden.pre('audit.check', (data) => {
  // extract variables
  const { by, updates, subject } = data;

  // prevent audit creation by setting prevent : true
  data.prevent = true;
});
```

Auditing logic allows us to hook and prevent creation of an audit item, or alter the updates/by fields.