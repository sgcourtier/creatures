(function(parent) {
  var njs = numeric;
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  var fps = 60;
  var t = 0;
  var dt = 1;

  function rectToPolar(vec) {
    var radius = njs.norm2(vec);
    var angle = Math.atan2(vec[1], vec[0]);

    return [radius, angle];
  }
  
  function polarToRect(vec) {
    var x = vec[0] * Math.cos(vec[1]);
    var y = vec[0] * Math.sin(vec[1]);
    
    return [x, y];
  }

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
                           speed: 0,
                           speedMax: 1,
                           orient: 2 * Math.PI * Math.random(),
                           angVel: 0,
                           angVelMax: 0.1,
                           energy: 10,
                           viewRange: 60,
                           viewSpan: 1
                          };
            
      simState.creatureStates.push(creatureState);
    }
    
    return simState;
  }

  function advance(simState, dt) {
    function advanceCreature(creatureState) {
      var vel = polarToRect([creatureState.speed, creatureState.orient]);

      creatureState.orient += creatureState.angVel * dt;
      creatureState.orient = creatureState.orient % (2 * Math.PI);
      njs.addeq(creatureState.pos, njs.dot(vel, dt));
      
      creatureState.speed += Math.random() * dt;
      creatureState.angVel += 0.1 * (Math.random() - 0.5) * dt;

      // Enforce motion limits
      if (creatureState.speed > creatureState.speedMax) {
        creatureState.speed = creatureState.speedMax;
      }
      if (creatureState.angVel < -creatureState.angVelMax) {
        creatureState.angVel = -creatureState.angVelMax;
      }
      if (creatureState.angVel > creatureState.angVelMax) {
        creatureState.angVel = creatureState.angVelMax;
      }

      // Check boundary.
      var center = [simState.radius, simState.radius];
      var disp = njs.sub(creatureState.pos, center);
      var dispPolar = rectToPolar(disp);
      if (dispPolar[0] > simState.radius) {
        dispPolar[0] = simState.radius;
        creatureState.pos = njs.add(center, polarToRect(dispPolar));
      }
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
      var x = creatureState.pos[0];
      var y = creatureState.pos[1];
      
      // Render body
      ctx.beginPath();
      ctx.arc(x, y, creatureState.radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'black';
      ctx.strokeStyle = 'black';
      ctx.fill();
      ctx.stroke();

      // Render view
      var leftAngle = creatureState.orient + creatureState.viewSpan / 2;
      var rightAngle = creatureState.orient - creatureState.viewSpan / 2;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, creatureState.viewRange, rightAngle, leftAngle);
      ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
      ctx.fill();
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
