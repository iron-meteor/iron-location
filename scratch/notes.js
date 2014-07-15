Location.get = function (options) {
  if (options && options.reactive !== false)
    this._dep.depend();
  return this._current;
};

Location.set = function (url, options) {
  this._current = Url.parse(url);
  this._dep.changed();
};

Location.start = function () {
  if (this.isStarted)
    return;
  this.isStarted = true;
  this._bindEvents();
};

Location.stop = function () {
  this._unbindEvents();
  this.isStarted = false;
};

/**
 * Set the on click link handler.
 */
Location.onClick = function (fn) {
  this._onClick = fn;
  return this;
};

Location._bindEvents = function () {
  $(window).on('popstate.iron-location', Location._onPopState.bind(Location));
};

Location._unbindEvents = function () {
  $(window).off('popstate.iron-location');
};

Location._onPopState = function (e) {
  console.log('onPopState', e);
};

Location._onClick = function (e) {
  var el = e.currentTarget;
  var which = _.isUndefined(e.which) ? e.button : e.which;
  var href = el.href;
  var path = el.pathname + el.search + el.hash;

  // ie9 omits the leading slash in pathname - so patch up if it's missing
  path = path.replace(/(^\/?)/,"/");

  // we only want to handle clicks on links which:
  // - haven't been cancelled already
  if (e.isDefaultPrevented())
    return;

  //  - are with the left mouse button with no meta key pressed
  if (which !== 1)
    return;

  if (e.metaKey || e.ctrlKey || e.shiftKey) 
    return;

  // - aren't in a new window
  if (el.target)
    return;

  // - aren't external to the app
  if (!IronLocation.isSameOrigin(href)) 
    return;

  // note that we _do_ handle links which point to the current URL
  // and links which only change the hash.
  e.preventDefault();

  //XXX set the location.
};

Location._dep = new Deps.Dependency;
