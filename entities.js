var entities = {};

var njs = numeric;
var util = utility;

entities.generateFood = function(radius) {
  var food = {radius: 5,
              pos: util.rndPos(radius),
              energy: 1e6
             };

  return food;
};

entities.generateCreature = function(pos) {
  var rndRadius = Math.random() * 15 + 2;
  var creature = {radius: rndRadius,
                  pos: pos,
                  speed: 0,
                  speedMax: 2,
                  orient: 2 * Math.PI * Math.random(),
                  angVel: 0,
                  angVelMax: 0.1,
                  viewRange: Math.random() * 75 + rndRadius,
                  viewSpan: Math.random() * 2.5 + 0.5,
                  energy: 1.5e6,
                  lifetime: 0
                 };

  return creature;
};

entities.eat = function(creature, foods) {
  for (var fdIdx = 0; fdIdx < foods.length; fdIdx++) {
    var food = foods[fdIdx];
    var disp = njs.sub(food.pos, creature.pos);
    var dispPolar = util.rectToPolar(disp);
    var alpha = creature.viewSpan / 2;
    var inRange = dispPolar[0] <= creature.viewRange;
    var inSpan = (creature.orient - alpha <= dispPolar[1]) &&
          (dispPolar[1] <= creature.orient + alpha);
    
    if (inRange && inSpan) {
      creature.energy += foods[fdIdx].energy;
      foods.splice(fdIdx, 1);
      
      fdIdx--;
    }
  }
};

entities.advancePos = function(creature, dt) {
  // Normalize orientation
  // TODO: Do this less retardedly
  var qrect = util.polarToRect([1, creature.orient]);
  var qpolar = util.rectToPolar(qrect);
  creature.orient = qpolar[1];

  // Integrate
  creature.orient += creature.angVel * dt;
  var vel = util.polarToRect([creature.speed, creature.orient]);
  njs.addeq(creature.pos, njs.dot(vel, dt));
  
  creature.speed += (Math.random() - 0.5) * dt;
  creature.angVel += 0.1 * (Math.random() - 0.5) * dt;

  // Enforce speed limits
  if (creature.speed > creature.speedMax) {
    creature.speed = creature.speedMax;
  }
  if (creature.speed < 0) {
    creature.speed = 0;
  }
  if (creature.angVel < -creature.angVelMax) {
    creature.angVel = -creature.angVelMax;
  }
  if (creature.angVel > creature.angVelMax) {
    creature.angVel = creature.angVelMax;
  }
};

entities.advanceEnergy = function(creature, dt) {
  creature.energy -= 2 * Math.pow(creature.radius, 2) * dt;
  creature.energy -= (creature.speed + creature.angVel) * dt;
  creature.energy -= creature.viewSpan * Math.pow(creature.viewRange, 2) * dt;
};

entities.advance = function(creature, foods, dt) {
  creature.lifetime += dt;

  entities.advanceEnergy(creature, dt);
  entities.advancePos(creature, dt);
  entities.eat(creature, foods);
};
