const MovingObject = require("./moving_object");
const Util = require("./util");


function randomColor() {
  const hexDigits = "0123456789ABCDEF";

  let color = "#";
  for (let i = 0; i < 3; i ++) {
    color += hexDigits[Math.floor((Math.random() * 16))];
  }

  return color;
}

const Player = function (options) {
  options.radius = Player.RADIUS;
  options.vel = options.vel || [0, 0];
  options.color = options.color || randomColor();

  MovingObject.call(this, options);
};

Player.prototype.type = "Player";

Player.RADIUS = 5;

Util.inherits(Player, MovingObject);


Player.prototype.power = function (impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
};

Player.prototype.relocate = function () {
  this.pos = this.game.randomPosition();
  this.vel = [0, 0];
};


Player.prototype.type = "Player";

module.exports = Player;
