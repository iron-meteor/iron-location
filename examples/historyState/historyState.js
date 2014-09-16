if (Meteor.isClient) {
  Template.hello.helpers({
    historyState: function() {
      return Iron.Location.get().options && 
        Iron.Location.get().options.historyState;
    }
  });
  
  Template.hello.events({
    'submit #push': function(e, t) {
      e.preventDefault();
      Iron.Location.go('/' + Random.id(), {historyState: t.$('input').val()});
    },
    'submit #replace': function(e, t) {
      e.preventDefault();
      console.log("Can't do this yet");
    }
  })
}
