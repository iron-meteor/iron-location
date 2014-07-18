// set of test URLs
var URLS = [
  {
    base: 'http://host:port/some/pathname/?query=string#bar',
    hash: 'http://host:port#/some/pathname/?query=string&hash=bar'
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
