Iron.Location
==============================================================================
Reactive urls that work with IE8/9 and modern pushState browsers.

## Installation
This package has a weak dependency on jQuery (similar as Blaze),
so you can add jQuery to your Meteor app from a [CDN](https://code.jquery.com/) or a [Meteor package](https://atmospherejs.com/meteor/jquery):
```
meteor add jquery
```

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
