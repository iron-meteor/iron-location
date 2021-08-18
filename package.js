Package.describe({
  name: 'iron:location',
  summary: 'Reactive urls that work in IE8/9 and modern browsers.',
  version: '1.0.11',
  git: 'https://github.com/eventedmind/iron-location.git'
});

Package.onUse(function (api) {
  api.versionsFrom('METEOR@0.9.2');

  api.use('underscore');
  api.use('tracker');
  api.use('jquery', { weak: true });

  api.use('iron:core@1.0.11');
  api.imply('iron:core');

  api.use('iron:url@1.0.11');

  api.use('appcache', {weak: true});

  api.addFiles('lib/utils.js', 'client');
  api.addFiles('lib/state.js', 'client');
  api.addFiles('lib/location.js', 'client');

  api.export(['urlToHashStyle', 'urlFromHashStyle'], 'client', {testOnly: true});
});

Package.onTest(function (api) {
  api.use('iron:location');
  api.use('tinytest');
  api.use('test-helpers');

  api.addFiles('test/location_test.js', 'client');
});
