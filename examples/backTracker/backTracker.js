if (Meteor.isClient) {
  var lastMethod = new ReactiveVar('initialLoad');
  var stateStack = [];
  var currentStateIdx = 0;
  
  // load the initial state
  var id = Random.id();
  stateStack.push(id);
  Iron.Location.replaceState({stateId: id});
  
  
  Iron.Location.onGo(function() {
    lastMethod.set('pushState');
    
    this.options.historyState = this.options.historyState || {};
    this.options.historyState.stateId = Random.id();
    
    currentStateIdx += 1;
    // drop any state that's past where we are inserting
    stateStack.splice(currentStateIdx, stateStack.length, this.options.historyState.stateId);
  });
  
  Iron.Location.onPopState(function() {
    console.log(stateStack, currentStateIdx, this.options.historyState.stateId);
    
    lastMethod.set('popState');
    
    // figure out where our current idx is now
    var lastIdx = currentStateIdx;
    currentStateIdx = _.indexOf(stateStack, this.options.historyState.stateId);
    
    // oh no, not in our history. We must have gotten here from back/forward
    // from a different site. We've lost our history, we are at a loss. Reset.
    //
    // XXX: ideally we would try to stop this from happening.
    if (currentStateIdx === -1) {
      currentStateIdx = 0;
      stateStack = [this.options.historyState.stateId];
    } else {
      if (currentStateIdx === lastIdx - 1) {
        lastMethod.set('back');
      } else if (currentStateIdx === lastIdx + 1) {
        lastMethod.set('forward');
      }
    }
  });
  
  Template.location.helpers({
    path: function() {
      return Iron.Location.get().path;
    },
    method: function() {
      return lastMethod.get();
    }
  });
  
  Template.location.events({
    'submit': function(e, t) {
      e.preventDefault();
      Iron.Location.go(t.$('input[type=text]').val());
    }
  });
}
