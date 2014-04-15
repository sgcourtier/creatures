var renderer = {
  canvas: document.getElementById('canvas')
};
renderer.ctx = renderer.canvas.getContext('2d');
renderer.renderFood = function(food) {
  renderer.ctx.beginPath();
  renderer.ctx.arc(food.pos[0], food.pos[1], food.radius, 0, 2 * Math.PI);
  renderer.ctx.fillStyle = 'orange';
  renderer.ctx.strokeStyle = 'black';
  renderer.ctx.fill();
  renderer.ctx.stroke();
};
renderer.renderCreature = function(creature) {
  var x = creature.pos[0];
  var y = creature.pos[1];
  
  // Render body
  renderer.ctx.beginPath();
  renderer.ctx.arc(x, y, creature.radius, 0, 2 * Math.PI);
  renderer.ctx.fillStyle = creature.energy > 0 ? 'black' :
    "rgba(100, 200, 100, 0.3)";
  renderer.ctx.strokeStyle = creature.energy > 0 ? 'black' : 'gray';
  renderer.ctx.fill();
  renderer.ctx.stroke();

  // Render view
  var leftAngle = creature.orient + creature.viewSpan / 2;
  var rightAngle = creature.orient - creature.viewSpan / 2;

  renderer.ctx.beginPath();
  renderer.ctx.moveTo(x, y);
  renderer.ctx.arc(x, y, creature.viewRange, rightAngle, leftAngle);
  renderer.ctx.fillStyle = creature.energy > 0 ? "rgba(255, 0, 0, 0.4)" :
    "rgba(100, 150, 100, 0.15)";
  renderer.ctx.fill();
};
renderer.renderEnvironment = function(env) {
  this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
  for (var fsIdx = 0; fsIdx < env.foods.length; fsIdx++) {
    this.renderFood(env.foods[fsIdx]);
  }

  for (var csIdx = 0; csIdx < env.creatures.length; csIdx++) {
    this.renderCreature(env.creatures[csIdx]);
  }
};
