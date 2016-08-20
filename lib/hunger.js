const Game = require('./game');
const GameView = require('./game_view');
let newGame = null;

document.addEventListener('DOMContentLoaded', function () {
  const view = document.getElementById('view');
  const menu = document.getElementById('menu');
  const title = document.getElementById('title');

});

document.addEventListener('keydown', function () {
  const canvasEl = document.getElementById('game');
  const ctx = canvasEl.getContext('2d');
  canvasEl.width = Game.DIM_X;
  canvasEl.height = Game.DIM_Y;
  newGame = newGame || new GameView(ctx);

  if (event.which === 32 && !newGame.playing) {
    view.className = 'off';
    title.className = 'off';
    canvasEl.className = 'fade-in';

    newGame.start();
  }
});
