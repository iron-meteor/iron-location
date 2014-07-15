var Url = Iron.Url;

/**
 * Given:
 *   http://host:port/some/pathname/?query=string#bar
 *
 * Return:
 *   http://host:port/?query=string&hash=bar/#/some/pathname
 */
urlToHashStyle = function (url) {
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
urlFromHashStyle = function (url) {
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

/**
 * Fix up a pathname intended for use with a hash path by moving any hash
 * fragments into the query string.
 */
fixHashPath = function (pathname) {
  var parts = Url.parse(pathname);
  var query = parts.queryObject;
  
  // if there's a hash in the path move that to the query string
  if (parts.hash) {
    query.hash = parts.hash.replace('#', '')
  }

  return [
    parts.pathname,
    Url.toQueryString(query)
  ].join('');
};
