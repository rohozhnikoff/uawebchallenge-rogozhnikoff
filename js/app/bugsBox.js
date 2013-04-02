var BugsBox = Backbone.View.extend({
  initialize: function () {
    this.dir = "left";
    this.boxWidth = 800;
    this.boxHeight = 600;
    this.left = 0;
    this.top = 0;
    this.stepH = this.boxWidth * 0.005;
    this.stepV = this.boxHeight * 0.0005;

    // запускаем движение по горизонтали
    this.interval = setInterval(_.bind(this.move, this), 1000 / this.options.speed);

    this.alert = this.radar;
    this.freezMe = this.freez;
    this.setSize = this.size;
  },
  size: function(){
    this.width = this.getRight(this.left) - this.left;
    this.height = this.getBottom(this.top) - this.top;
  },
  freez: function(){
    clearInterval(this.interval);
  },
  move: function () {
    // можно кешировать его позицию и отсчитывать от него перемещение
    var newLeft = (this.getDir() === "left") ? this.left += this.stepH : this.left -= this.stepH;
    var newTop = this.top += this.stepV;
    this.$el.css({left: Math.floor(newLeft), top: Math.floor(newTop)});

    // находим соприкосновение с нижней границей
    if(this.getBottom(newTop) >= this.boxHeight) {
      window.game.loose();
      // слушаем вход в зону корабля
    } else if(this.getBottom(newTop) >= this.boxHeight - 20){
      // проверяем соприкосновение отдельно
      if(this.isTouchShip()){
        window.game.loose();
      }
    }
  },
  // находим соприкосновения по крайним точкам корабля
  isTouchShip: function(){
    var shipPoints = window.game.ship.getPoints();
    return this.isPointInZone(shipPoints[0]) || this.isPointInZone(shipPoints[1]) || this.isPointInZone(shipPoints[2]) || this.isPointInZone(shipPoints[3]);
  },
  getBottom: function(top){
    top = top || 0;
    // находим последний элемент
    var last = this.options.list.lastBottom();
    return top + last.top + last.height;
  },
  getRight: function(left){
    left = left || 0;
    // находим последний элемент
    var last = this.options.list.lastRight();
    return left + last.left + last.width;
  },
  getDir: function () {
    if (this.dir === "left") {
      if (this.boxWidth - (this.left + this.width) <= 0)
        this.dir = "right"
    } else if (this.dir === "right") {
      if (this.left <= 0)
        this.dir = "left"
    }

    return this.dir;
  },
  getRelativePosition: function(left, top){
    return {
      left: left - this.left,
      top: top - this.top
    }
  },
  isPointInZone: function(left, top){
    if (typeof top === "undefined") {
      top = left.top;
      left = left.left;
    }
    var horizontal = left >= this.left && left <= this.left + this.width;
    var vertical = top >= this.top && top <= this.top + this.height;

    return horizontal && vertical;
  },
  radar: function (left, top) {
    // проверяем, заходит ли он вообще в зону (чтобы не делать лишних расчетов)
    if(this.isPointInZone(left, top)) {
      // получаем относительные позиции пули
      var positions = this.getRelativePosition(left, top);
      // ищем возможного убитого
      var killed = this.options.list.find(function(bug){return bug.hit(positions)});
      if (typeof killed !== "undefined") {
        // убиваем
        this.options.list.crash(killed);
        // останавливаем
        window.game.ship.kill();
      }
    }
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