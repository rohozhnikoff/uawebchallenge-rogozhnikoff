var Bug = Backbone.Model.extend({
  initialize: function () {
    this.height = 20;
    this.width = 20;
    this.surplus = this.get("count") % 7;
    // вычисляем и записываем
    this.left = (this.surplus * this.width) + (this.surplus * this.width);
    this.top = (Math.floor(this.get("count") / 7) * this.height) + (Math.floor(this.get("count") / 7) * this.height);


    // вносим хаос
    if (this.get("count") % 2 === 0) {
      this.top += this.height * this.getHaos();
      this.left += this.width * this.getHaos();
    }

    this.get("el").css({
      left: this.left,
      top: this.top
    });

    this.crashMe = this.crash;
  },
  getHaos: function(){
    var haoses = [
        1 // диагональная сетка
      , 0.66 // орнамент
      , 0.5
      , Math.PI / 2
      , Math.PI * 1.2
      , Math.PI * 1.6
    ];
    return haoses[window.game.level - 1] || haoses[1];
  },
  hit: function (positions) {
    var horizontal = positions.left >= this.left && positions.left <= this.left + this.width;
    var vertical = positions.top >= this.top && positions.top <= this.top + this.height;

    return horizontal && vertical;
  },
  crash: function () {
    this.get("el").animate({backgroundColor: "#000000"}, {easing: "easeOutCirc", duration: 300, complete: function () {
      $(this).remove();
    }});
  }
});