# zn-resource

Handle Zengine API resources in Zengine backend services (unofficial).

# Install

```sh
$ npm install zn-resource
```

# Use

```js
// Require the built-in ZnHttp (notice the path depends on where you are)
var ZnHttp = require('../../lib/zn-http.js');

// Inject ZnHttp into zn-resource and ask for the resource service you want
var znRecordService = require('zn-resource')({ resource: 'record', ZnHttp: ZnHttp });
var znFormService = require('zn-resource')({ resource: 'form', ZnHttp: ZnHttp });
var znActivityService = require('zn-resource')({ resource: 'activity', ZnHttp: ZnHttp });
```

For each of those services, you should be able to perform regular CRUD operations plus extra things, depending on the service.

## Records

Get record:

```js

  var id = {
    id: 40
    formId: 5
  };

  // GET /forms/5/records/40
  znRecordService.get(id).then(function(record) {
    // record.id === 40
    // record.formId === 5 (set by the service for convenience)
  });
```

Query records (paginated):

```js

  var request = {
    formId: 5
    field123: 'apples'
  };

  // GET /forms/5/records?field123=apples
  znRecordService.query(request).then(function(response) {
    // response.totalCount
    // response.data
  });
```

Create record:

```js

  var record = {
    formId: 5,
    field123: 'apples'
  };

  // POST /forms/5/records
  znRecordService.save(request).then(function(record) {

  });
```
Update record:

```js

  var record = {
    id: 40,
    formId: 5,
    field123: 'apples'
  };

  // PUT /forms/5/records/40
  znRecordService.save(request).then(function(record) {

  });
```
Find by field value:

```js

  var record = {
    formId: 5,
    fieldId: 123,
    value: 'apples'
  };

  // GET /forms/5/records?field123=apples&limit=1
  znRecordService.findByFieldValue(request).then(function(record) {
    // record or null
  });
```

## Forms

Similar to record service but you get an instance of [ZnForm](https://github.com/rcarraretto/zn-resource/blob/master/src/zn-form.js) instead, which means you not only get form data but you can also call methods.

```js

  // GET /forms/5
  znFormService.get(5).then(function(form) {
    // form instanceof ZnForm === true
    // form.id === 5
    // form.getEmailValidatedFields()
  });
```

Query forms

```js

  var request = {
    workspace: {
      id: 18
    }
  };
  
  // GET /forms?workspace.id=18&attributes=id,name&related=fields,folders
  znFormService.query(request).then(function(forms) {
  
  });
```
## Testing

To test your backend service without doing actual requests to Zengine, you can use [zn-resource-fake](https://github.com/rcarraretto/zn-resource-fake).
