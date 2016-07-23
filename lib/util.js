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
