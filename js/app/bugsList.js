var BugsList = Backbone.Collection.extend({
  model: Bug,
  initialize: function(){

  },
  crash: function(model){
    model.crashMe();
    _.delay(function(collection){collection.remove(model)}, 300, this);
  },
  lastBottom: function(){
    // не подходит, если будет рандомное расставление
    // return this.models[this.models.length - 1];

    return this.max(function(bug){return bug.top})
  },
  lastRight: function(){
    return this.max(function(bug){return bug.left});
  }
});