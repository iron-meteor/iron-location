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
      var state = $(e.target).find('input').val();
      Iron.Location.go('/' + Random.id(), {historyState: state});
    },
    'submit #replace': function(e, t) {
      e.preventDefault();
      var state = $(e.target).find('input').val();
      Iron.Location.replaceState(state);
    }
  })
}
