// NOTE: Right now, ties are settled by position in the array. This is fine as long as the place is randomized for successive trials.

var fps = 60;
var t = 0;
var dt = 10;

var foodParams = {radiusMean: 4,
                  radiusVariance: 2,
                  energyPerArea: 1e6
                 };
var creatureParams = {radiusMean: 12,
                      radiusVariance: 11,
                      viewRangeMean: 30,
                      viewRangeVariance: 700,
                      viewSpanMean: Math.PI / 4,
                      viewSpanVariance: 4,
                      
                      speedMaxCoef: 4e2,
                      angVelMaxCoef: 15,
                      energyMaxPerArea: 2.5e3,
                      energyLossPerArea: 1.5,
                      energyLossPerViewArea: 0.05,
                      energyLossPerMove: 1e3
                     };
environment.populate(foodParams, creatureParams, 400, 15);

function loop() {
  t += dt;

  environment.update(dt);
  renderer.renderEnvironment(environment);
}

setInterval(loop, 1e3 / fps);

