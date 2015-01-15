Package.describe({
  summary: 'Reactive urls that work in IE8/9 and modern browsers.',
  version: '1.0.7',
  git: 'https://github.com/eventedmind/iron-location.git'
});

Package.on_use(function (api) {
  api.versionsFrom('METEOR@0.9.2');
  
  api.use('underscore');
  api.use('tracker');
  api.use('jquery');

  api.use('iron:core@1.0.7');
  api.imply('iron:core');

  api.use('iron:url@1.0.7');

  api.use('appcache', {weak: true});
  
  api.add_files('lib/utils.js', 'client');
  api.add_files('lib/state.js', 'client');
  api.add_files('lib/location.js', 'client');

  api.export(['urlToHashStyle', 'urlFromHashStyle'], 'client', {testOnly: true});
});

Package.on_test(function (api) {
  api.use('iron:location');
  api.use('tinytest');
  api.use('test-helpers');

  api.add_files('test/location_test.js', 'client');
});
