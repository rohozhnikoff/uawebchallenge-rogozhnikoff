var Bug = Backbone.Model.extend({
  initialize: function () {
    _.extend(this, {
      height: 20,
      width: 20,
      surplus: this.get("count") % 7,
      crashMe: this.crash
    });

    // рассчитываем позиции
    var position = this.getPosition();
    this.get("el").css({
      left: this.left = position.left,
      top: this.top = position.top
    });
  },

  // проверяем на попадание снаряда в жука
  hit: function (positions) {
    var horizontal = positions.left >= this.left && positions.left <= this.left + this.width;
    var vertical = positions.top >= this.top && positions.top <= this.top + this.height;

    return horizontal && vertical;
  },

  // уничтожение
  crash: function () {
    this.get("el").animate({backgroundColor: "#000000"}, {easing: "easeOutCirc", duration: 300, complete: function () {
      $(this).remove();
    }});
  },

  // получаем позиции с учетом хаоса
  getPosition: function(){
    var position = {};
    // вычисляем и записываем
    position.left = (this.surplus * this.width) + (this.surplus * this.width);
    position.top = (Math.floor(this.get("count") / 7) * this.height) + (Math.floor(this.get("count") / 7) * this.height);

    // вносим хаос
    if (this.get("count") % 2 === 0) {
      position.left += this.width * this.getHaos();
      position.top += this.height * this.getHaos();
    }

    return position;
  },

  // получаем значения хаоса для данного жука
  getHaos: function(){
    var haoses = [
      1 // диагональная сетка
      , 0.66 // орнамент
      , 0.5
      , Math.PI / 2
      , Math.PI * 1.2
      , Math.PI * 1.6
    ];
    // возращаем соответствующую формулу уровню, или случайную
    return haoses[window.game.level - 1] || _(haoses).shuffle()[0];
  }
});