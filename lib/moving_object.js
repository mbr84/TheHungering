const Util = require('./util');

const MovingObject = function (options) {
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius;
  this.color = options.color;
  this.game = options.game;
};

MovingObject.prototype.bounceOffWall = function (x, y) {
  if (this.pos[0] + this.radius >= x && this.vel[0] > 0) {
    this.vel[0] *= -1;
  }

  if (this.pos[0] - this.radius <= 0 && this.vel[0] < 0) {
    this.vel[0] *= -1;
  }

  if (this.pos[1] - this.radius <= 0 && this.vel[1] < 0) {
    this.vel[1] *= -1;
  }

  if (this.pos[1] + this.radius >= y && this.vel[1] > 0) {
    this.vel[1] *= -1;
  }
};

MovingObject.prototype.collideWith = function (otherObject) {
  const ratio = 1.5;
  if (this.radius > otherObject.radius) {
    this.radius += ratio / 2;
    otherObject.radius -= ratio;

    if (otherObject.radius <= 1) {
      this.game.remove(otherObject);
    }

  } else {
    this.radius -= ratio;
    otherObject.radius += ratio / 3;


    if (this.radius <= 1) {
      this.game.remove(this);
    }
  }
};

MovingObject.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;
  const renderRadius = (this.radius > 1) ? this.radius : 0;
  ctx.beginPath();
  ctx.arc(
    this.pos[0], this.pos[1], renderRadius, 0, 2 * Math.PI, true);
  ctx.fill();
};

MovingObject.prototype.isCollidedWith = function (otherObject) {
  let centerDist = Util.dist(this.pos, otherObject.pos);
  return centerDist < (this.radius + otherObject.radius);
};

MovingObject.prototype.grow = function () {
	this.radius += 0.1
};


const NORMAL_FRAME_TIME_DELTA = 1000 / 60;
MovingObject.prototype.move = function (timeDelta) {
  this.pos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];
};

module.exports = MovingObject;
