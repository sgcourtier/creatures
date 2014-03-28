(function(parent) {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var fps = 60;
  var t = 0;
  var dt = 1;

  function buildSimState(numFood) {
    function rndPos() {
      var rndRadius = Math.sqrt(Math.random()) * simState.radius;
      var rndAngle =  Math.random() * 2 * Math.PI;
      var rndx = simState.radius + rndRadius * Math.cos(rndAngle);
      var rndy = simState.radius + rndRadius * Math.sin(rndAngle);
      
      return {x:rndx, y:rndy};
    }
    function buildFoodState() {
      var foodState = {radius: 5,
                       pos: rndPos(),
                       energy: 10
                      };

      return foodState;
    }
    
    var simState = {};
    
    simState.radius = 300;
    
    simState.foodStates = [];
    for (var i = 0; i < numFood; i++) {
      var foodState = buildFoodState();
            
      simState.foodStates.push(foodState);
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < simState.foodStates.length; i++) {
      renderFoodState(simState.foodStates[i]);
    }
  }

  var simState = buildSimState(100);

  function loop() {
    t += dt;

    render(simState);
  }
  
  setInterval(loop, 1e3 / fps);
})(window);
