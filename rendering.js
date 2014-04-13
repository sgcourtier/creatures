var rendering = {};

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

rendering.renderFood = function(food) {
  ctx.beginPath();
  ctx.arc(food.pos[0], food.pos[1], food.radius,
          0, 2 * Math.PI);
  ctx.fillStyle = 'orange';
  ctx.strokeStyle = 'black';
  ctx.fill();
  ctx.stroke();
};

rendering.renderCreature = function(creature) {
  var x = creature.pos[0];
  var y = creature.pos[1];
  
  // Render body
  ctx.beginPath();
  ctx.arc(x, y, creature.radius, 0, 2 * Math.PI);
  ctx.fillStyle = creature.energy > 0 ? 'black' : "rgba(100, 200, 100, 0.3)";
  ctx.strokeStyle = creature.energy > 0 ? 'black' : 'gray';
  ctx.fill();
  ctx.stroke();

  // Render view
  var leftAngle = creature.orient + creature.viewSpan / 2;
  var rightAngle = creature.orient - creature.viewSpan / 2;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.arc(x, y, creature.viewRange, rightAngle, leftAngle);
  ctx.fillStyle = creature.energy > 0 ? "rgba(255, 0, 0, 0.4)" :
    "rgba(100, 150, 100, 0.15)";
  ctx.fill();
};

rendering.renderSim = function(sim) {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (var fsIdx = 0; fsIdx < sim.foods.length; fsIdx++) {
    rendering.renderFood(sim.foods[fsIdx]);
  }

  for (var csIdx = 0; csIdx < sim.creatures.length; csIdx++) {
    rendering.renderCreature(sim.creatures[csIdx]);
  }
};
