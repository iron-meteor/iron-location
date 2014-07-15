Tinytest.add('Location - urlToHashStyle', function (test) {
  var original = 'http://localhost:3000/some/path?query=string#foo';
  var expected = 'http://localhost:3000/?query=string&hash=foo#/some/path'
});
