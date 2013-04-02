var Game = Backbone.View.extend({
  defaults: {
    speed: "normal",
    bugsAmount: 42,
    keyNames: {
      37: "left",
      39: "right",
      32: "space"
    }
  },
  initialize: function () {
    _.extend(this, {
      body: $("body"),
      speed: 1,
      level: 1,
      action: this.$el.find(".action")
    });
  },
  // пробрасываем ивенты от кнопок "играть"
  events: {
    "click .action .start": "start",
    "click .action .again": "restart"
  },

  // начинаем игру
  start: function () {
    this.action.hide();
    this.createGame();
  },
  // начинаем игру заново
  restart: function () {
    this.clean();
    this.start();
  },
  // левел done, перезапускаем
  finish: function () {
    this.clean();

    // увеличиваем скорость
    this.speed = this.speed * 1.5;
    // меняем левел
    this.level++;

    // перезапускаем
    this.start();
  },
  // проигрыш
  loose: function () {
    // замораживаем процессы
    this.bugsBox.freezMe();
    this.ship.freezMe();

    this.action.show().addClass("_loose");
  },


  // создаем и начинаем игру
  createGame: function () {
    this.bugs = new BugsList();
    this.bugsBox = new BugsBox({list: this.bugs, speed: this.speed});
    this.bugsBox.setElement($("<div>", {class: "bugs"}));
    this.ship = new Ship({bugsBox: this.bugsBox});

    _(this.defaults.bugsAmount).times(_.bind(function (i) {
      this.bugs.add(new Bug({el: $("<i>", {class: "bug"}).appendTo(this.bugsBox.el), count: i}));
    }, this));

    this.bugsBox.$el.appendTo(this.$el);
    this.bugsBox.setSize();

    this.body.on("keydown keyup", _.bind(this.keyPress, this));
    this.pressed = [];

    this.bugs.on("remove", _.bind(function () {
      // при окончании, перезапускаем на новый левел
      if (!this.bugs.length) {
        this.finish()
      }

      // переписываем размеры
      this.bugsBox.setSize();
    }, this));
  },
  // отлавливаем события клавиатуры
  keyPress: function (ev) {
    // TODO: есть какая-то сложновоспроизводимая проблема с залипанием, при переключении между вкладками
    var keyCode = ev.which;

    // фильтруем только наши кнопки
    if (this.isKeyDir(keyCode)) {
      // защита от двойных срабатываний при залипании

      // проверяем отсутствует ли эта кнопка в массиве нажатых
      if (!this.inPressed(keyCode)) {
        // добавляем в массив нажатых
        this.pressed.push(keyCode);
        // пробрасываем дальше
        this.keyDown(keyCode);

      } else if (this.inPressed(keyCode) && ev.type === "keyup") {
        // удаляем его из массива "нажатых"
        this.pressed.splice(this.pressed.indexOf(keyCode), 1);
        // пробрасываем дальше
        this.keyUp(keyCode);
      }
      // пробел пробрасываем сразу к ship
    } else if (this.getNamefromKeyCode(keyCode) === "space") {
      // выключаем дефолтное поведение, чтобы не скролилась страница
      ev.preventDefault();
      this.ship.fire()
    }
  },


  // перезапускаем процесс, если нажата другая кнопка
  shipStop: function () {
    if (this.pressed.length) {
      this.keyDown(this.pressed[0]);
    }
  },
  // чистим игру для перезапуска
  clean: function () {
    // TODO: чисти меня полностью (вариант с перезапуском основного контроллера)

    // снимаем бинды с контролов
    this.body.off();

    this.bugsBox.destroy();
    this.ship.destroy();

    this.speed = 1;
    this.level = 1;
  },
  // нажата ли кнопка
  inPressed: function (key) {
    return _(this.pressed).any(function (code) {
      return code === key
    });
  },
  // пробрасываем нажатие
  keyDown: function (code) {
    this.ship.move(this.getNamefromKeyCode(code));
  },
  // пробрасываем "отжатие"
  keyUp: function (code) {
    this.ship.stop(this.getNamefromKeyCode(code));
  },
  // получаем нормальное имя кнопки
  getNamefromKeyCode: function (code) {
    return _(this.defaults.keyNames).find(function (value, key) {
      return parseInt(key) === code
    });
  },
  // определяем, является ли кнопка двигательной
  isKeyDir: function (code) {
    return _([37, 39]).any(function (key) {
      return key === code
    });
  }
});