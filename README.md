Iron.Location
==============================================================================
Reactive urls that work with IE8/9 and modern pushState browsers.

## Example

```javascript
Deps.autorun(function () {
  // returns a "location" like object with all of the url parts
  var current = Iron.Location.get();

  var href = current.href;
  var state = current.state;
  var host = current.host;
  // etc
});
```
