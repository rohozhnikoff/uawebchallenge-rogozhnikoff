var BugsBox = Backbone.View.extend({
  initialize: function () {
    _.extend(this, {
      dir: "left",
      boxWidth: 800,
      boxHeight: 600,
      left: 0,
      top: 0,
      alert: this.radar,
      freezMe: this.freez,
      setSize: this.size
    });

    // рассчитыаем шаг по горизонтали
    this.stepH = this.boxWidth * 0.005;
    // рассчитыаем шаг по вертикали
    this.stepV = this.boxHeight * 0.0005;

    // запускаем движение по горизонтали
    this.interval = setInterval(_.bind(this.move, this), 1000 / this.options.speed);
  },

  // двигаем весь блок
  move: function () {
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

  // метод оповещения о движении снаряда
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



  // получаем крайнюю нижнюю точку
  getBottom: function(top){
    top = top || 0;
    // находим последний элемент
    var last = this.options.list.lastBottom();
    return top + last.top + last.height;
  },

  // получаем крайнюю правую точку
  getRight: function(left){
    left = left || 0;
    // находим последний элемент
    var last = this.options.list.lastRight();
    return left + last.left + last.width;
  },

  // проверяем точку на наличие в потенциальной зоне попадения
  isPointInZone: function(left, top){
    if (typeof top === "undefined") {
      top = left.top;
      left = left.left;
    }
    var horizontal = left >= this.left && left <= this.left + this.width;
    var vertical = top >= this.top && top <= this.top + this.height;

    return horizontal && vertical;
  },

  // переводим абсолютные позиции в относительные, относительно BugsBox
  getRelativePosition: function(left, top){
    return {
      left: left - this.left,
      top: top - this.top
    }
  },

  // находим соприкосновения по крайним точкам корабля
  isTouchShip: function(){
    var shipPoints = window.game.ship.getPoints();
    return this.isPointInZone(shipPoints[0]) || this.isPointInZone(shipPoints[1]) || this.isPointInZone(shipPoints[2]) || this.isPointInZone(shipPoints[3]);
  },

  // вычисляем крайние значения и меняем направление
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

  // переопределяем размеры
  size: function(){
    this.width = this.getRight(this.left) - this.left;
    this.height = this.getBottom(this.top) - this.top;
  },

  // замораживаем движение
  freez: function(){
    return clearInterval(this.interval);
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