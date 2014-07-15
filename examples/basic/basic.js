if (Meteor.isClient) {
  Deps.autorun(function (c) {
    var value = Iron.Location.get();
    console.log('Iron.Location.get(): ', value && value.href);
  });
}

if (Meteor.isServer) {
  WebApp.connectHandlers.use(function (req, res, next) {
    console.log(req.method + ': ' + req.url);
    next();
  });
}
