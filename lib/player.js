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
  debugger
  this.vel[0] += impulse[0];
  this.vel[1] += impulse[1];
  that = this;
  const hyp = Math.sqrt(Math.pow(Math.abs(this.vel[0]*10), 2) + Math.pow(Math.abs(this.vel[1]*10), 2))
  var horizDiff = Math.abs(this.radius*10 / (hyp / this.vel[0])) || 0
  var vertDiff = Math.abs(this.radius*10 / (hyp / this.vel[1])) || 0

  monsterInitOpts = {
    vel: that.vel.map((dir) => {
      return dir * -1;
    }),

    game: that.game,

    radius: ((that.radius / 20) > 1 ? that.radius / 20 : 1),

    pos: [that.pos[0] + ((horizDiff * (-1 * that.vel[0] / Math.abs(that.vel[0]))) || that.radius),
    that.pos[1] + ((vertDiff * (-1 * that.vel[1] / Math.abs(that.vel[1]))) || that.radius)],
  };
  this.radius -= (this.radius / 60);

  this.game.objects.push(new Monster(monsterInitOpts));
};

Player.prototype.type = 'Player';

module.exports = Player;
