if (Meteor.isClient) {
  Deps.autorun(function (c) {
    var value = Iron.Location.get();
    console.log('Iron.Location.get()', value.href);
  });
}
