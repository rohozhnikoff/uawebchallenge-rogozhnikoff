var BugsList = Backbone.Collection.extend({
  model: Bug,
  initialize: function(){

  },
  crash: function(model){
    model.crashMe();
    _.delay(function(collection){collection.remove(model)}, 300, this);
  },
  // получаем крайний нижний жук
  lastBottom: function(){
    return this.max(function(bug){return bug.top})
  },
  // получаем крайний правый жук
  lastRight: function(){
    return this.max(function(bug){return bug.left});
  }
});