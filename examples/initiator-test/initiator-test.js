Router.map(function() {
  this.route('a');
  this.route('b');
})

if (Meteor.isClient) {
  // XXX: no UI.body, why?
  var helpers = {
    initiator: function() {
      return Router.current().initiator;
    }
  };
  Template.a.helpers(helpers);
  Template.b.helpers(helpers);
  
  events = {
    'click [data-initiator]': function(e) {
      e.stopImmediatePropagation();
      e.preventDefault();
      
      Router.go($(e.target).attr('href'), {initiator: $(e.target).data('initiator')});
    },
    'click [data-back]': function() {
      Iron.Location.back();
    }
  };
  Template.a.events(events)
  Template.b.events(events)
}
