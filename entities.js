// NOTE: Sometimes it looks like there is a bug---that creatures aren't eating the food in their view. This is because they're full.

var entities = {};

var njs = numeric;
var util = utility;

// Food params
entities.foodParams = {radiusMean: 4,
                       radiusVariance: 2,
                       foodEnergyPerArea: 1e6
                      };

// Creature params
entities.creatureParams = {radiusMean: 12,
                           radiusVariance: 11,
                           viewRangeMean: 30,
                           viewRangeVariance: 700,
                           viewSpanMean: Math.PI / 4,
                           viewSpanVariance: 4,
                           speedMaxCoef: 4e2,
                           angVelMaxCoef: 15,
                           energyMaxPerArea: 5e3,
                           energyLossPerArea: 1.5,
                           energyLossPerViewArea: 0.05,
                           energyLossPerMove: 1e3
                          };

entities.generateFood = function(radius) {
  var params = entities.foodParams;
  var rndRadius = util.rnorm(params.radiusMean, params.radiusVariance, 1);
  var area = Math.PI * rndRadius * rndRadius;
  var food = {radius: rndRadius,
              pos: util.rndPos(radius),
              energy: params.foodEnergyPerArea * area
             };

  return food;
};

entities.generateCreature = function(pos) {
  var params = entities.creatureParams;
  var rndRadius = util.rnorm(params.radiusMean, params.radiusVariance, 5);
  var area = util.diskArea(rndRadius);
  var energyMax = area * params.energyMaxPerArea;
  
  var creature = {radius: rndRadius,
                  viewRange: util.rnorm(rndRadius + params.viewRangeMean,
                                        params.viewRangeVariance, 1),
                  viewSpan: util.rnorm(params.viewSpanMean,
                                       params.viewSpanVariance,
                                       1, 2 * Math.PI),
                  pos: pos,
                  speed: 0,
                  speedMax: params.speedMaxCoef / (1 + area),
                  orient: 2 * Math.PI * Math.random(),
                  angVel: 0,
                  angVelMax: params.angVelMaxCoef / (1 + area),
                  energy: energyMax / 2,
                  energyMax: energyMax,
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
  
  creature.speed += util.rnorm(creature.speedMax / 2,
                               creature.speedMax) * dt;
  creature.angVel += 2 * creature.angVelMax * (Math.random() - 0.5) * dt;

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
  var params = entities.creatureParams;
  
  creature.energy -= params.energyLossPerArea *
    util.diskArea(creature.radius) * dt;
  creature.energy -= params.energyLossPerViewArea *
    creature.viewSpan * Math.pow(creature.viewRange, 2) * dt;
  creature.energy -= params.energyLossPerMove *
    (creature.speed + creature.angVel) * dt;

  if (creature.energy > creature.energyMax) {
    creature.energy = creature.energyMax;
  }
};

entities.advance = function(creature, foods, dt) {
  creature.lifetime += dt;

  entities.advanceEnergy(creature, dt);
  entities.advancePos(creature, dt);
  entities.eat(creature, foods);
};
