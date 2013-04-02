requirejs.config({
  baseUrl: "js/lib",
  paths: {
    app: '../app'
  },
  shim: {
    "backbone": {
      deps: ["underscore", "jquery"],
      exports: "Backbone"
    },
    "underscore": {
      exports: "_"
    },
    "jquery": {
      exports: "$"
    },
    "jquery.color": ['jquery'],
    "easing": ['jquery']
  }
});

requirejs(["jquery", "backbone", "jquery.color", "easing"], function($){
  requirejs(["app/bugsBox", "app/bug", "app/bugsList", "app/ship", "app/game"], function(){
    // по хорошему, надо разделить саму игру и интерфейс, но мне лень
    window.game = new Game({
      el: "#screen"
    });
  });
});