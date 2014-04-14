// NOTE: Right now, ties are settled by position in the array. This is fine as long as the place is randomized for successive trials.

var njs = numeric;
var util = utility;
var ent = entities;
var simu = simulation;
var rend = rendering;

var fps = 60;
var t = 0;
var dt = 1;

var sim = simu.populate(300, 12);

function loop() {
  t += dt;

  simu.advance(sim, dt);
  rend.renderSim(sim);
}

setInterval(loop, 1e3 / fps);

