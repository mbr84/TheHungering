const Util = require("./util");
const MovingObject = require("./moving_object");


const DEFAULTS = {
	COLOR: "#000",
};

const Monster = function (options = {}) {
  options.color = DEFAULTS.COLOR;
  options.pos = options.pos || options.game.randomPosition();
  options.vel = Util.randomVec((Math.random() * 0.5) + .01);

  MovingObject.call(this, options);
};

Monster.prototype.move = function () {
  this.pos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];
};


Util.inherits(Monster, MovingObject);

Monster.prototype.type = "Monster";

module.exports = Monster;
