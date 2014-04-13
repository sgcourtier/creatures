var utility = {};

utility.rectToPolar = function(vec) {
  var radius = njs.norm2(vec);
  var angle = Math.atan2(vec[1], vec[0]);

  return [radius, angle];
};

utility.polarToRect = function(vec) {
  var x = vec[0] * Math.cos(vec[1]);
  var y = vec[0] * Math.sin(vec[1]);
  
  return [x, y];
};

utility.rndPos = function(rMax) {
  var rndRadius = Math.sqrt(Math.random()) * rMax;
  var rndAngle =  Math.random() * 2 * Math.PI;
  var rndx = rMax + rndRadius * Math.cos(rndAngle);
  var rndy = rMax + rndRadius * Math.sin(rndAngle);
  
  return [rndx, rndy];
};
