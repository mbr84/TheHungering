const Monster = require('./monster');
const Player = require('./player');

const Game = function () {
  this.objects = [];
};

Game.DIM_X = window.innerWidth - 20;
Game.DIM_Y = window.innerHeight - 20;
Game.NUM_MONSTERS = 200;
Game.BG_COLOR = '#fff';
Game.CENTER_X = Game.DIM_X / 2;
Game.CENTER_Y = Game.DIM_Y / 2;

Game.prototype.addMonsters = function () {
  for (let i = 0; i < Game.NUM_MONSTERS; i++) {
    let size;
    if (i % 25 === 0) {
      size = Math.random() * 30;
    } else {
      size = Math.random() * 6;
    }
    this.objects.push(new Monster({ game: this, radius: size }));
  }
};

Game.prototype.addMonster = function () {
  const size = 1;
  let newMonster = new Monster({
    game: this,
    radius: size,
    growing: true,
    finalSize: Math.random() * 6 + 3,
  });

  if (this.areaClear(newMonster)) {
    this.objects.push(newMonster);
  } else {
    this.addMonster();
  }
};

Game.prototype.remove = function (object) {
  const index = this.objects.indexOf(object);
  if (index > -1) {

    this.objects.splice(index, 1);
  }
};

Game.prototype.addPlayer = function () {
  this.player = new Player({
    pos: [Game.CENTER_X, Game.CENTER_Y],
    game: this,
  });

  this.objects.push(this.player);

  return this.player;
};

Game.prototype.allObjects = function () {
  return [].concat(this.playerArray, this.monsters);
};

Game.prototype.randomPosition = function () {
  let legitLocation = false;
  while (!legitLocation) {
    var coords = getRandomCoords();
    if (Math.abs(Game.CENTER_X - coords[0]) > 15 &&
    Math.abs(Game.CENTER_Y - coords[1]) > 15) {
      legitLocation = true;
    }
  }
  return coords;
};

const getRandomCoords = function () {
  return [
    window.innerWidth * Math.random(),
    window.innerHeight * Math.random(),
  ];
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  ctx.fillStyle = Game.BG_COLOR;
  ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.objects.forEach(function (object) {
    object.draw(ctx);
  });
};

Game.prototype.step = function () {
  this.moveObjects();
  this.checkCollisions();
  if (Math.random() * 1000 >= 997 && this.objects.length > 4) {
    this.addMonster();
  }
  this.growMonsters()
};

Game.prototype.growMonsters = function () {
  this.objects.forEach((object) => {
    if (object.growing) {
      object.grow()
      if (object.radius > object.finalSize) {
        object.growing = false
      }
    }
  })
};

Game.prototype.checkCollisions = function () {
  for (let i = 0; i < this.objects.length; i++) {
    for (let j = i + 1; j < this.objects.length; j++) {
      if (this.objects[i].isCollidedWith(this.objects[j])) {
        this.objects[i].collideWith(this.objects[j]);
      }
    }
  }
};

Game.prototype.areaClear = function (object) {
  for (let i = 0; i < this.objects.length; i++) {
    if (object.isCollidedWith(this.objects[i])) {
      return false
    }
  }
  return true
};

Game.prototype.complete = function () {
  if (this.objects.indexOf(this.player) === -1) {
    return ('loss');
  } else if (this.objects.length === 1) {
    return ('win');
  }
};

Game.prototype.moveObjects = function () {
  this.objects.forEach((object) => {
    object.move();
    object.bounceOffWall(Game.DIM_X, Game.DIM_Y);
  });
};

module.exports = Game;
