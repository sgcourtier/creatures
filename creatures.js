(function(parent) {
  var njs = numeric;
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var fps = 60;
  var t = 0;
  var dt = 1;

  function buildSimState(numFood, numCreatures) {
    function rndPos(rMax) {
      var rndRadius = Math.sqrt(Math.random()) * rMax;
      var rndAngle =  Math.random() * 2 * Math.PI;
      var rndx = rMax + rndRadius * Math.cos(rndAngle);
      var rndy = rMax + rndRadius * Math.sin(rndAngle);
      
      return [rndx, rndy];
    }
    
    var simState = {};
    
    simState.radius = 300;
    
    simState.foodStates = [];
    for (var fsIdx = 0; fsIdx < numFood; fsIdx++) {
      var foodState = {radius: 5,
                       pos: rndPos(simState.radius),
                       energy: 10
                      };
            
      simState.foodStates.push(foodState);
    }

    simState.creatureStates = [];
    for (var csIdx = 0; csIdx < numCreatures; csIdx++) {
      var creatureState = {radius: 15,
                           pos: rndPos(simState.radius),
                           energy: 10
                          };
            
      simState.creatureStates.push(creatureState);
    }
    
    return simState;
  }

  function advance(simState, dt) {
    function advanceCreature(creature) {
      creature.radius = creature.radius * 1.001;
    }

    for (var csIdx = 0; csIdx < simState.creatureStates.length; csIdx++) {
      advanceCreature(simState.creatureStates[csIdx]);
    }
  }

  function render(simState) {
    function renderFoodState(foodState) {
      ctx.beginPath();
      ctx.arc(foodState.pos[0], foodState.pos[1], foodState.radius,
              0, 2 * Math.PI);
      ctx.fillStyle = 'orange';
      ctx.strokeStyle = 'black';
      ctx.fill();
      ctx.stroke();
    }
    function renderCreatureState(creatureState) {
      ctx.beginPath();
      ctx.arc(creatureState.pos[0], creatureState.pos[1],
              creatureState.radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.strokeStyle = 'black';
      ctx.fill();
      ctx.stroke();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var fsIdx = 0; fsIdx < simState.foodStates.length; fsIdx++) {
      renderFoodState(simState.foodStates[fsIdx]);
    }
    
    for (var csIdx = 0; csIdx < simState.creatureStates.length; csIdx++) {
      renderCreatureState(simState.creatureStates[csIdx]);
    }
  }

  var simState = buildSimState(100, 20);

  function loop() {
    t += dt;

    advance(simState, dt);
    render(simState);
  }
  
  setInterval(loop, 1e3 / fps);
})(window);
