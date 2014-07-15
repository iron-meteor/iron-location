/*****************************************************************************/
/* Imports */
/*****************************************************************************/
var Url = Iron.Url;

/*****************************************************************************/
/* Both */
/*****************************************************************************/
Location = {};

/**
 * Given:
 *   http://host:port/some/pathname/?query=string#bar
 *
 * Return:
 *   http://host:port/?query=string&hash=bar/#/some/pathname
 */
Location.urlToHashStyle = function (url) {
  var parts = Url.parse(url);
  var hash = parts.hash && parts.hash.replace('#', '');
  var search = parts.search;
  var pathname = parts.pathname;
  var root = parts.rootUrl; 

  // do we have another hash value that isn't a path?
  if (hash && hash.charAt(0) !== '/') {
    var hashQueryString = 'hash=' + hash;
    search = search ? (search + '&') : '?';
    search += hashQueryString;
  }

  // if we don't already have a path on the hash create one
  if (!hash || hash.charAt(0) !== '/') {
    hash = pathname ? '#' + pathname : '';
  } else if (hash) {
    hash = '#' + hash;
  }

  return [
    root,
    hash,
    search
  ].join('');
};

/**
 * Given a url that uses the hash style (see above), return a new url that uses
 * the hash path as a normal pathname.
 *
 * Given:
 *   http://host:port/?query=string&hash=bar/#/some/pathname
 * 
 * Return:
 *   http://host:port/some/pathname?query=string#bar
 */
Location.urlFromHashStyle = function (url) {
  var parts = Url.parse(url);
  var pathname = parts.hash && parts.hash.replace('#', '');
  var search = parts.search;
  var root = parts.rootUrl;
  var hash;

  // see if there's a hash=value in the query string in which case put it back
  // in the normal hash position and delete it from the search string.
  if (_.has(parts.queryObject, 'hash')) {
    hash = '#' + parts.queryObject.hash;
    delete parts.queryObject.hash;
  } else {
    hash = '';
  }

  return [
    root,
    pathname,
    Url.toQueryString(parts.queryObject),
    hash
  ].join('');
};

/*****************************************************************************/
/* Client */
/*****************************************************************************/
if (Meteor.isClient) {
  var dep = new Deps.Dependency;
  var current = null;

  Location.isIE9 = function () {
    return /MSIE 9/.test(navigator.appVersion);
  };

  Location.isIE8 = function () {
    return /MSIE 8/.test(navigator.appVersion);
  };

  Location.shouldUseHashPaths = function () {
    return Location.isIE9() || Location.isIE8();
  };

  Location.get = function () {
    dep.depend();
    return current;
  };

  Location._set = function (state) {
    if (!(state instanceof State))
      throw new Error("Expected a State instance");

    if (!current || (current && !current.equals(state))) {
      current = state;
      dep.changed();
    }
  };

  if (Location.shouldUseHashPaths()) {
    var parts = Url.parse(location.href);

    if (parts.pathname.length > 1 || parts.hash) {
      // if we have a pathname or any hash let's go to the server so we can come
      // back on the root url with the hash converted to a special query string
      // parameter called hash.
      var url = Location.urlToHashStyle(location.href);

      //XXX we need to be careful for infinite redirects here. There should be
      //some way of preventing that.
      window.location = url;
    }
  }

  // set initial state
  if (Location.shouldUseHashPaths()) {
    var state = new State(Location.urlFromHashStyle(location.href));
    Location._set(state);
  } else {
    var state = new State(location.href, history.state);
    history.replaceState({initial: true}, null, location.href);
    Location._set(state);
  }

  $(window).on('popstate.iron-location', function (e) {
    if (Location.shouldUseHashPaths()) {
      var state = new State(Location.urlFromHashStyle(location.href));
      Location._set(state);
    } else {
      var state = new State(location.href, history.state);
      Location._set(state);
    }
  });

  $(window).on('hashchange.iron-location', function (e) {
    if (Location.shouldUseHashPaths()) {
      var state = new State(Location.urlFromHashStyle(location.href));
      Location._set(state);
    } else {
      var state = new State(location.href, history.state);
      Location._set(state);
    }
  });

  var linkSelector = 'a[href]';
  Meteor.startup(function () {
    $(document).on('click', linkSelector, function (e) {
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

        //XXX if there's a hashfrag in the url we need to deal with that and put
        //it in the query string
        //XXX if there's a hash in the querystring, Url.parse should pull that
        //out
        //XXX for some reason having a hash in the url is causing a full page
        //refresh in ie8.
        if (Location.shouldUseHashPaths()) {
          var state = new State(path);
          Location._set(state);
          location.hash = path;
        } else {
          var state = new State(path, history.state);
          history.pushState(state.state, state.title, path);
          Location._set(state);
        }
      } catch (err) {
        // make sure we can see any errors that are thrown before going to the
        // server.
        e.preventDefault();
        throw err;
      }
    });
  });
}

/*****************************************************************************/
/* Namespacing */
/*****************************************************************************/
Iron.Location = Location;
