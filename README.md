## `applyDiff`
Apply differences of an object with another object to it.

### Usage

**In browser**
include underscore or lodash and this module
```html
<script src="underscore.js"></script>
<script src="apply-diff/index.js"></script>
```
```js
_.applyDiff(source, destination);
```

**In NodeJS**
```js
var underscore = require('underscore');
require('apply-diff')(_);
_.applyDiff(source, destination);
```

### Development
Install dependencies
```
npm install
```

`npm run watch` to run tests with watch

`npm test` ro run tests

### License 
MIT
