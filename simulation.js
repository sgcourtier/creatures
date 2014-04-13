var simulation = {};

var njs = numeric;
var util = utility;
var ent = entities;

simulation.generate = function(numFood, numCreatures) {
  var sim = {};
  
  sim.radius = 300;
  
  sim.foods = [];
  for (var fsIdx = 0; fsIdx < numFood; fsIdx++) {
    var food = ent.generateFood(sim.radius);
    
    sim.foods.push(food);
  }

  sim.creatures = [];
  for (var csIdx = 0; csIdx < numCreatures; csIdx++) {
    var creature = ent.generateCreature([sim.radius, sim.radius]);
    
    sim.creatures.push(creature);
  }
  
  return sim;
};

simulation.advance = function(sim, dt) {
  // Advance creatures
  for (var csIdx = 0; csIdx < sim.creatures.length; csIdx++) {
    var creature = sim.creatures[csIdx];
    
    if (creature.energy >  0) {
      ent.advance(creature, sim.foods, dt);

      // Enforce boundary
      var center = [sim.radius, sim.radius];
      var disp = njs.sub(creature.pos, center);
      var dispPolar = util.rectToPolar(disp);
      if (dispPolar[0] > sim.radius) {
        dispPolar[0] = sim.radius;
        creature.pos = njs.add(center, util.polarToRect(dispPolar));
      }
    }
  }
};
