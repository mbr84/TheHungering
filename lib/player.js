const MovingObject = require('./moving_object');
const Util = require('./util');
const Monster = require('./monster');


function randomColor() {
  const hexDigits = '0123456789ABCDEF';

  let color = '#';
  for (let i = 0; i < 3; i ++) {
    color += hexDigits[Math.floor((Math.random() * 16))];
  }

  return color;
}


const Player = function (options) {
  options.radius = Player.RADIUS;
  this.finalSize = 0;
  options.vel = options.vel || [0, 0];
  options.color = options.color || randomColor();

  MovingObject.call(this, options);
};

Player.prototype.type = 'Player';

Player.RADIUS = 8;

Util.inherits(Player, MovingObject);


Player.prototype.power = function (impulse) {
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
  that = this;

  monsterInitOpts = {
    vel: that.vel.map((dir) => {
      return dir * -1;
    }),

    game: that.game,

    radius: ((that.radius / 20) > 1 ? that.radius / 20 : 1),

    pos: [that.pos[0] + ((that.radius * (-1 * that.vel[0] / Math.abs(that.vel[0]))) || that.radius),
    that.pos[1] + ((that.radius * (-1 * that.vel[1] / Math.abs(that.vel[1]))) || that.radius)],
  };
  this.radius -= (this.radius / 60);

  this.game.objects.push(new Monster(monsterInitOpts));
};

Player.prototype.type = 'Player';

module.exports = Player;
