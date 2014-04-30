var util = utility;

var environment = {
  radius: 400,
  foods: [],
  creatures: []
};
environment.isActive = function() {
  var result = false;
  
  for (var csIdx = 0; csIdx < this.creatures.length; csIdx++) {
    if (this.creatures[csIdx].energy > 0) {
      result = true;
      break;
    };
  }
  
  return result;
};
environment.rankCreatures = function() {
  function compare(creature1, creature2) {
    if (creature1.lifetime > creature2.lifetime)
      return -1;
    if (creature1.lifetime < creature2.lifetime)
      return 1;
    return 0;
  }
  
  this.creatures.sort(compare);
};
environment.randomizedFood = function(params) {
  var food = new Food(util.rndPos(this.radius));
  
  food.pos = util.rndPos(this.radius);
  food.radius = util.rnorm(params.radiusMean, params.radiusVariance, 1);
  food.energyPerArea = params.energyPerArea;
  
  return food;
};
environment.randomizedCreature = function(params) {
  //var creature = new Creature([this.radius, this.radius]);
  var creature = new Creature(util.rndPos(this.radius));

  creature.energy = creature.energyMax() / 2;
  creature.orient = 2 * Math.PI * Math.random();
  creature.radius = util.rnorm(params.radiusMean, params.radiusVariance, 5);
  creature.viewRange = util.rnorm(creature.radius + params.viewRangeMean,
                                  params.viewRangeVariance, creature.radius);
  creature.viewSpan = util.rnorm(params.viewSpanMean,
                                 params.viewSpanVariance,
                                 1, 2 * Math.PI);
  
  creature.speedMaxCoef = params.speedMaxCoef;
  creature.angVelMaxCoef = params.angVelMaxCoef;
  creature.energyMaxPerArea = params.energyMaxPerArea;
  creature.energyLossPerArea = params.energyLossPerArea;
  creature.energyLossPerViewArea = params.energyLossPerViewArea;
  creature.energyLossPerMove = params.energyLossPerMove;
  
  return creature;
};
environment.init = function() {
  this.foods = [];
  this.creatures = [];
};
environment.populate = function(foodParams, creatureParams,
                                numFoods, numCreatures) {
  for (var fsIdx = 0; fsIdx < numFoods; fsIdx++) {
    this.foods.push(this.randomizedFood(foodParams));
  }
  
  for (var csIdx = 0; csIdx < numCreatures; csIdx++) {
    this.creatures.push(this.randomizedCreature(creatureParams));
  }
};
environment.update = function(dt) {
  // Update creatures
  for (var csIdx = 0; csIdx < this.creatures.length; csIdx++) {
    var creature = this.creatures[csIdx];
    
    creature.update(this.foods, dt);

    // Enforce boundary
    // TODO: Do this less retardedly
    var center = [this.radius, this.radius];
    var disp = njs.sub(creature.pos, center);
    var dispPolar = util.rectToPolar(disp);
    
    if (dispPolar[0] > this.radius) {
      dispPolar[0] = this.radius;
      creature.pos = njs.add(center, util.polarToRect(dispPolar));
    }
  }
};
