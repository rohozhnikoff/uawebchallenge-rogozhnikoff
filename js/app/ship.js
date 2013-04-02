// класс корабля
var Ship = Backbone.View.extend({
  initialize: function () {
    _.extend(this, {
      parent: window.game.$el,
      bugs: this.options.bugsBox,
      widthBox: 800,
      inAnimate: false,
      isFire: false,
      kill: this.stopFire,
      freezMe: this.freez,
      getPoints: this.points
    });
    this.setElement($("<div>", {class: "ship"}).appendTo(this.parent));
    this.shell = $("<i>", {class: "shell"}).appendTo(this.parent).hide();
    this.setLeft();
    this.top = this.$el.position().top;
  },

  // создаем анимацию движения
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
  // останавливаем анимацию движения
  stop: function (dir) {
    if (this.inAnimate === dir || typeof dir === "undefined") {
      this.$el.stop();
      this.inAnimate = false;
      this.setLeft();

      // оповещаем game об остановке
      window.game.shipStop();
    }
  },

  // включаем анимацию снаряда
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
  // пробрасываем положение снаряда к BugsBox
  // TODO: написать свой листенер. Шаг у текущего где-то 15 пикселей (теоретически возможны прострелы на больших скоростях).
  step: function (top, anim) {
    // оповещаем о своих координатах bugsBox
    this.bugs.alert(this.shellLeft, top);
  },
  // останавливаем анимацию снаряда
  stopFire: function () {
    this.shell.stop().hide();
    this.isFire = false;
  },

  // возвращаем координаты 4-ех крайних точек
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
  // рассчитываем длительность анимации для ее равномерности
  getDuration: function (dir) {
    // определяем дистанцию
    var distance = (dir === "left") ? this.left : (this.widthBox - this.left);
    // возвращаем процент от 5 секунд
    return  Math.ceil((distance / this.widthBox) * 5000);
  },
  // переустанавливаем горизонтальную координату
  setLeft: function () {
    return this.left = parseInt(this.$el.css("left"))
  },
  // замораживаем контроллер
  freez: function(){
    this.isFreez = true;
    this.stop();
  },
  // уничтожаем контроллер
  destroy: function() {
    this.freez();

    this.undelegateEvents();
    this.$el.removeData().unbind();
    //Remove view from DOM
    this.remove();
    Backbone.View.prototype.remove.call(this);
  }
});