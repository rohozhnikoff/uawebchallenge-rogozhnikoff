// класс корабля
var Ship = Backbone.View.extend({
  initialize: function () {
    this.parent = window.game.$el;
    this.bugs = this.options.bugsBox;
    this.$el = $("<div>", {class: "ship"}).appendTo(this.parent);
    this.setLeft();
    this.widthBox = 800;
    this.inAnimate = false;

    this.isFire = false;
    this.shell = $("<i>", {class: "shell"}).appendTo(this.parent).hide();

    this.kill = this.stopFire;
    this.freezMe = this.freez;
    this.getPoints = this.points;

    this.top = this.$el.position().top;
  },
  points: function(){
    return [
        // левый верхний
        {top: this.top, left: this.left}
        // правый верхний
      , {top: this.top, left: this.left + 20}
        // правый нижний
      , {top: this.top + 20, left: this.left + 20}
        // левый нижний
      , {top: this.top + 20, left: this.left}
    ]
  },
  freez: function(){
    this.isFreez = true;
    this.stop();
  },
  // рассчитываем длительность анимации для ее равномерности
  getDuration: function (dir) {
    // определяем дистанцию
    var distance = (dir === "left") ? this.left : (this.widthBox - this.left);
    // возвращаем процент от 5 секунд
    return  Math.ceil((distance / this.widthBox) * 5000);
  },
  move: function (dir) {
    if (!this.inAnimate && !this.isFreez) {
      this.inAnimate = dir;

      var newLeft = (dir === "left") ? 0 : this.widthBox - 20;
      this.$el.animate(
        {left: newLeft}
        , {easing: "linear", duration: this.getDuration(dir)},
        _.bind(function () {
          this.inAnimate = false
        }, this)
      );
    }
  },
  stop: function (dir) {
    if (this.inAnimate === dir || typeof dir === "undefined") {
      this.$el.stop();
      this.inAnimate = false;
      this.setLeft();

      // оповещаем game об остановке
      window.game.shipStop();
    }
  },
  setLeft: function () {
    return this.left = parseInt(this.$el.css("left"))
  },
  fire: function () {
    if (!this.isFire && !this.isFreez) {
      this.isFire = true;
      this.shellLeft = this.setLeft() + 10;
      this.shell.css({left: this.shellLeft, top: 580}).show()
        .animate({top: 0}, {
            easing: "linear"
          , duration: 500
          , step: _.bind(this.step, this)
          , complete: _.bind(this.stopFire, this)
        });
    }
  },
  // TODO: запустить свой листенер
  // шаг у текущего где-то 15 пикселей (мало, теоретически возможны прострелы на больших скоростях)
  step: function (top, anim) {
    // оповещаем о своих координатах bugsBox
    this.bugs.alert(this.shellLeft, top);
  },
  stopFire: function () {
    this.shell.stop().hide();
    this.isFire = false;
  },
  destroy: function() {
    this.freez();

    this.undelegateEvents();
    this.$el.removeData().unbind();
    //Remove view from DOM
    this.remove();
    Backbone.View.prototype.remove.call(this);
  }
});