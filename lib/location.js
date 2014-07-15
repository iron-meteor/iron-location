/*****************************************************************************/
/* Imports */
/*****************************************************************************/
var Url = Iron.Url;

/*****************************************************************************/
/* Private */
/*****************************************************************************/
var current = null;
var dep = new Deps.Dependency;

var isIE9 = function () {
  return /MSIE 9/.test(navigator.appVersion);
};

var isIE8 = function () {
  return /MSIE 8/.test(navigator.appVersion);
};

var shouldUseHashPaths = function () {
  return Location.options.useHashPaths || isIE8() || isIE9();
};

var isUsingHashPaths = function () {
  return !!Location.options.useHashPaths;
};

var set = function (state) {
  if (!(state instanceof State))
    throw new Error("Expected a State instance");

  if (!state.equals(current)) {
    current = state;
    dep.changed();
  }
};

var setStateFromEventHandler = function () {
  var href = location.href;
  var historyState = (typeof history !== 'undefeind') ? history.state : {};

  if (isUsingHashPaths()) {
    var state = new State(urlFromHashStyle(href), historyState);
    set(state);
  } else {
    var state = new State(href, historyState);
    set(state);
  }
};

var fireOnClick = function (e) {
  var handler = onClickHandler;
  handler && handler(e);
};

var onClickHandler = function (e) {
  try {
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
    if (!Url.isSameOrigin(href, location.href))
      return;

    // note that we _do_ handle links which point to the current URL
    // and links which only change the hash.
    e.preventDefault();

    if (isUsingHashPaths()) {
      var state = new State(path);
      set(state);
      location.hash = fixHashPath(path);
    } else {
      var state = new State(path, history.state);
      history.pushState(state.state, state.title, path);
      set(state);
    }
  } catch (err) {
    // make sure we can see any errors that are thrown before going to the
    // server.
    e.preventDefault();
    throw err;
  }
};
/*****************************************************************************/
/* Location API */
/*****************************************************************************/

/**
 * Main Location object. Reactively respond to url changes. Normalized urls
 * between hash style (ie8/9) and normal style using pushState.
 */
Location = {};

/**
 * Default options.
 */
Location.options = {
  linkSelector: 'a[href]',
  useHashPaths: false
};

/**
 * Set options on the Location object.
 */
Location.configure = function (options) {
  _.extend(this.options, options || {});
};

/**
 * Reactively get the current state.
 */
Location.get = function () {
  dep.depend();
  return current;
};

/**
 * Set the initial state and start listening for url events.
 */
Location.start = function () {
  if (this._isStarted)
    return;

  // if we're using the /#/items/5 style then start off at the root url but
  // store away the pathname, query and hash into the hash fragment so when the
  // client gets the response we can render the correct page.
  if (shouldUseHashPaths()) {
    // if we have any pathname like /items/5 take a trip to the server to get us
    // back a root url.
    var parts = Url.parse(location.href);

    if (parts.pathname.length > 1) {
      var url = urlToHashStyle(location.href);
      window.location = url;
    }

    // ok good to go
    this.configure({useHashPaths: true});
  }

  // set initial state
  var href = location.href;
  var historyState = (typeof history !== 'undefined') ? history.state : {};
  historyState = historyState || {};
  historyState.initial = true;

  if (isUsingHashPaths()) {
    var state = new State(urlFromHashStyle(href));
    set(state, historyState);
  } else {
    var state = new State(href, historyState);
    history.replaceState(historyState, null, href);
    set(state);
  }

  // bind the event handlers
  $(window).on('popstate.iron-location', setStateFromEventHandler);
  $(window).on('hashchange.iron-location', setStateFromEventHandler);

  // make sure we have a document before binding the click handler
  Meteor.startup(function () {
    $(document).on('click.iron-location', Location.options.linkSelector, fireOnClick);
  });
};

/**
 * Stop the Location from listening for url changes.
 */
Location.stop = function () {
  if (!this._isStarted)
    return;

  $(window).on('popstate.iron-location');
  $(window).on('hashchange.iron-location');
  $(document).off('click.iron-location');

  this._isStarted = false;
};

/**
 * Assign a different click handler.
 */
Location.onClick = function (fn) {
  onClickHandler = fn;
};

/**
 * Automatically start Iron.Location
 */
Location.start();

/*****************************************************************************/
/* Namespacing */
/*****************************************************************************/
Iron.Location = Location;
