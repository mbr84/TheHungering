/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(6);
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


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Monster = __webpack_require__(2);
	const Player = __webpack_require__(5);
	
	const Game = function () {
	  this.objects = [];
	};
	
	Game.DIM_X = window.innerWidth - 20;
	Game.DIM_Y = window.innerHeight - 20;
	Game.NUM_MONSTERS = 250;
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
	    finalSize: Math.random() * 10 + 2,
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
	
	  this.objects.sort((x, y) => {
	    return x.radius - y.radius
	  }).forEach(function (object) {
	    object.draw(ctx);
	  });
	};
	
	Game.prototype.step = function () {
	  this.moveObjects();
	  this.checkCollisions();
	  if (Math.random() * 1000 >= 990 && this.objects.length > 4) {
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	const MovingObject = __webpack_require__(4);
	
	
	const DEFAULTS = {
		COLOR: "#000",
	};
	
	const Monster = function (options = {}) {
	  options.color = DEFAULTS.COLOR;
	  options.pos = options.pos || options.game.randomPosition();
	  options.vel = options.vel || Util.randomVec((Math.random() * 0.5) + .01);
		this.growing = options.growing || false;
		this.finalSize = options.finalSize || 0
	  if (options.game) {
			options.game
		}
	
	  MovingObject.call(this, options);
	};
	
	Monster.prototype.move = function () {
	  this.pos = [this.pos[0] + this.vel[0], this.pos[1] + this.vel[1]];
	};
	
	
	Util.inherits(Monster, MovingObject);
	
	Monster.prototype.type = "Monster";
	
	module.exports = Monster;


/***/ },
/* 3 */
/***/ function(module, exports) {

	const Util = {
	
	  dir(vector) {
	    const norm = Util.norm(vector);
	    return Util.scale(vector, 1 / norm);
	  },
	
	  dist(pos1, pos2) {
	    return Math.sqrt(
	      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
	    );
	  },
	
	  norm(vector) {
	    return Util.dist([0, 0], vector);
	  },
	
	  randomVec(length) {
	    const deg = Math.PI * Math.random();
	    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
	  },
	
	  scale(vector, n) {
	    return [vector[0] * n, vector[1] * n];
	  },
	
	  inherits(Child, Parent) {
	    function Surrogate() { this.constructor = Child; }
	    Surrogate.prototype = Parent.prototype;
	    Child.prototype = new Surrogate();
	  },
	};
	
	module.exports = Util;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Util = __webpack_require__(3);
	
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
	  if (this.radius > otherObject.radius) {
	    const growthRatio = this.radius >= 250 ? 0 : ((250 - this.radius) / 250)
	
	    this.radius += growthRatio;
	    otherObject.radius -= 1;
	
	    if (otherObject.radius <= 1) {
	      this.game.remove(otherObject);
	    }
	
	  } else {
	    const growthRatio = otherObject.radius >= 250 ? 0 : ((250 - otherObject.radius) / 250) / 2
	    this.radius -= 1;
	    otherObject.radius += growthRatio;
	
	
	    if (this.radius <= 1) {
	      this.game.remove(this);
	    }
	  }
	};
	
	MovingObject.prototype.draw = function (ctx) {
	  ctx.fillStyle = this.color;
	  ctx.beginPath();
	  ctx.arc(
	    this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
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


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(3);
	const Monster = __webpack_require__(2);
	
	
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
	  const that = this;
	
	  const horizV = Math.abs(this.vel[0])
	  const vertV = Math.abs(this.vel[1])
	
	  var horizDiff = Math.cos(Math.atan(vertV / horizV)) * this.radius
	  var vertDiff = Math.sin(Math.atan(vertV / horizV)) * this.radius
	  monsterInitOpts = {
	    vel: that.vel.map((dir) => {
	      return dir * -1;
	    }),
	
	    game: that.game,
	
	    radius: ((that.radius / 20) > 1 ? that.radius / 20 : 1),
	
	    pos: [that.pos[0] + (Math.ceil(horizDiff) * (-1 * that.vel[0] / Math.abs(that.vel[0])) || 0),
	    that.pos[1] + (Math.ceil(vertDiff) * (-1 * that.vel[1] / Math.abs(that.vel[1])) || 0)],
	  };
	  this.radius -= (this.radius / 60);
	
	  this.game.objects.push(new Monster(monsterInitOpts));
	};
	
	Player.prototype.type = 'Player';
	
	module.exports = Player;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1)
	const GameView = function (ctx) {
	  this.ctx = ctx;
	  this.playing = false
	
	};
	
	GameView.MOVES = {
	  'up': [ 0, -.2],
	  'left': [-.2,  0],
	  'down': [ 0,  .2],
	  'right': [ .2,  0],
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
	  this.game = new Game();
	  this.game.addMonsters();
	  this.game.addPlayer();
	  this.player = this.game.player;
	  this.playing = true;
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
	  const view = document.getElementById('view');
	  const menu = document.getElementById('menu');
	  const canvas = document.getElementById('game');
	  const winner = document.getElementById('winner');
	  const loser = document.getElementById('loser');
	
	  if (result === 'loss') {
	    this.playing = false;
	    view.className = 'on';
	    winner.className = 'off';
	    menu.className = 'fade-in';
	    loser.className = 'fade-in';
	    canvas.className = 'transparent';
	  } else if (result === 'win') {
	    this.playing = false;
	    view.className = 'fade-in';
	    loser.className = 'off';
	    menu.className = 'fade-in';
	    winner.className = 'fade-in';
	    canvas.className = 'transparent';
	  }
	};
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map