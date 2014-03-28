(function(parent) {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var fps = 60;
  var t = 0;
  var dt = 1;

  function buildSimState(numFood) {
    function rndPos(rMax) {
      var rndRadius = Math.sqrt(Math.random()) * rMax;
      var rndAngle =  Math.random() * 2 * Math.PI;
      var rndx = rMax + rndRadius * Math.cos(rndAngle);
      var rndy = rMax + rndRadius * Math.sin(rndAngle);
      
      return {x:rndx, y:rndy};
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
    for (var csIdx = 0; csIdx < numFood; csIdx++) {
      var creatureState = {radius: 15,
                           pos: rndPos(simState.radius),
                           energy: 10
                          };
            
      simState.creatureStates.push(creatureState);
    }
    
    return simState;
  }

  function render(simState) {
    function renderFoodState(foodState) {
      ctx.beginPath();
      ctx.arc(foodState.pos.x, foodState.pos.y, foodState.radius,
              0, 2 * Math.PI);
      ctx.fillStyle = 'orange';
      ctx.strokeStyle = 'black';
      ctx.fill();
      ctx.stroke();
    }
    function renderCreatureState(creatureState) {
      ctx.beginPath();
      ctx.arc(creatureState.pos.x, creatureState.pos.y, creatureState.radius,
              0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.strokeStyle = 'black';
      ctx.fill();
      ctx.stroke();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < simState.foodStates.length; i++) {
      renderFoodState(simState.foodStates[i]);
    }
    
    for (var i = 0; i < simState.creatureStates.length; i++) {
      renderCreatureState(simState.creatureStates[i]);
    }
  }

  var simState = buildSimState(100);

  function loop() {
    t += dt;

    render(simState);
  }
  
  setInterval(loop, 1e3 / fps);
})(window);
