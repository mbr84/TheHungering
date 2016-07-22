const Game = require('./game')
const GameView = function (ctx) {
  this.ctx = ctx;
  this.playing = false

};

GameView.MOVES = {
  "up": [ 0, -.2],
  "left": [-.2,  0],
  "down": [ 0,  .2],
  "right": [ .2,  0],
};

GameView.prototype.bindKeyHandlers = function () {
  const player = this.player;

  Object.keys(GameView.MOVES).forEach(function (k) {
    const move = GameView.MOVES[k];
    key(k, function () { player.power(move); });
  });
};

GameView.prototype.start = function () {
  this.lastTime = 0;
  this.game = new Game()
  this.game.addMonsters()
  this.game.addPlayer()
  this.player = this.game.player
  this.playing = true

  this.bindKeyHandlers();

  requestAnimationFrame(this.animate.bind(this));
};

GameView.prototype.animate = function(time){
  const timeDelta = time - this.lastTime;
  this.game.step(timeDelta);
  this.game.draw(this.ctx);
  const result = this.game.complete();
  this.lastTime = time;
  if (result) {
    this.isOver(result);
  } else {
    requestAnimationFrame(this.animate.bind(this));
  }

};

GameView.prototype.isOver = function(result) {
  const view = document.getElementById("view")
  const menu = document.getElementById("menu")
  const canvas = document.getElementById("game")
  const winner = document.getElementById("winner")
  const loser = document.getElementById("loser")

  if (result === "loss"){
    this.playing = false
    view.className = "on"
    winner.className = "off"
    menu.className = "fade-in"
    loser.className = "fade-in"
    canvas.className = "transparent"


  } else if (result === "win"){
    this.playing = false
    view.className = "fade-in"
    loser.className = "off"
    menu.className = "fade-in"
    winner.className = "fade-in"
    canvas.className = "transparent"

  }

};

module.exports = GameView;
