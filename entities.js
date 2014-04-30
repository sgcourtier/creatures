function Entity(pos) {
  this.pos = pos;
  this.radius = 20;
}
Entity.prototype.area = function() {
  return Math.PI * Math.pow(this.radius, 2);
};


function Food(pos) {
  Entity.call(this, pos);
  this.energyPerArea = 1e6;
}
Food.prototype = new Entity;

Food.prototype.energy = function() {
  return this.energyPerArea * this.area();
};


function Creature(pos) {
  Entity.call(this, pos);
  this.orient = 0;
  this.speed = 0;
  this.angVel = 0;
  this.viewRange = 100;
  this.viewSpan = Math.PI / 2;
  this.energy = 1e3;
  this.lifetime = 0;

  this.speedMaxCoef = 4e2;
  this.angVelMaxCoef = 15;
  this.energyMaxPerArea = 5e3;
  this.energyLossPerArea = 1.5;
  this.energyLossPerViewArea = 0.05;
  this.energyLossPerMove = 1e3;
}
Creature.prototype = new Entity;

Creature.prototype.energyMax = function() {
  return this.area() * this.energyMaxPerArea;
};
Creature.prototype.speedMax = function() {
  return this.speedMaxCoef / (1 + this.area());
};
Creature.prototype.angVelMax = function() {
  return this.angVelMaxCoef / (1 + this.area());
};
Creature.prototype.eat = function(foods) {
  for (var fdIdx = 0; fdIdx < foods.length; fdIdx++) {
    var food = foods[fdIdx];
    var disp = njs.sub(food.pos, this.pos);
    var dispPolar = util.rectToPolar(disp);
    var alpha = this.viewSpan / 2;
    var inRange = dispPolar[0] <= this.viewRange;
    var inSpan = (this.orient - alpha <= dispPolar[1]) &&
          (dispPolar[1] <= this.orient + alpha);
    
    if (inRange && inSpan) {
      this.energy += foods[fdIdx].energy();
      foods.splice(fdIdx, 1);
      fdIdx--;
    }
  }
};
Creature.prototype.deplete = function(dt) {
  this.energy -= this.energyLossPerArea * this.area() * dt;
  this.energy -= this.energyLossPerViewArea * this.viewSpan / 2 *
    Math.pow(this.viewRange, 2) * dt;
  this.energy -= this.energyLossPerMove * (this.speed + this.angVel) * dt;

  // Enforce energy limits
  if (this.energy < 0) {
    this.energy = 0;
  }
  if (this.energy > this.energyMax()) {
    this.energy = this.energyMax();
  }
};
Creature.prototype.move = function(dt) {
  // Normalize orientation
  // TODO: Do this less retardedly
  var qrect = util.polarToRect([1, this.orient]);
  var qpolar = util.rectToPolar(qrect);
  this.orient = qpolar[1];

  // Integrate
  this.orient += this.angVel * dt;
  var vel = util.polarToRect([this.speed, this.orient]);
  njs.addeq(this.pos, njs.dot(vel, dt));

  // Randomly perturbe speed and angular velocity
  this.speed += util.rnorm(this.speedMax() / 2,
                           this.speedMax()) * dt;
  this.angVel += 2 * this.angVelMax() * (Math.random() - 0.5) * dt;

  // Enforce speed limits
  if (this.speed > this.speedMax()) {
    this.speed = this.speedMax();
  }
  if (this.speed < 0) {
    this.speed = 0;
  }
  if (this.angVel < -this.angVelMax()) {
    this.angVel = -this.angVelMax();
  }
  if (this.angVel > this.angVelMax()) {
    this.angVel = this.angVelMax();
  }
};
Creature.prototype.update = function(foods, dt) {
  if (this.energy > 0) {
    this.lifetime += dt;
    this.deplete(dt);
    this.move(dt);
    this.eat(foods);
  }
};
