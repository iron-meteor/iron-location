// set of test URLs
var URLS = [
  {
    base: 'http://host:port/some/pathname/?query=string#bar',
    hash: 'http://host:port#!some/pathname/?query=string&__hash__=bar'
  },
  {
    // using a param called 'hash'
    base: 'http://host:port/some/pathname/?hash=string',
    hash: 'http://host:port#!some/pathname/?hash=string'
  } 
]

Tinytest.add('Location - urlToHashStyle', function (test) {
  _.each(URLS, function(urls) {
    test.equal(urlToHashStyle(urls.base), urls.hash);
  });
});


Tinytest.add('Location - urlFromHashStyle', function (test) {
  _.each(URLS, function(urls) {
    test.equal(urlFromHashStyle(urls.hash), urls.base);
  })
});
