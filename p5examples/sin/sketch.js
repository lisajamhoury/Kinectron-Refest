// Just a few tweaks to:  The Nature of by Code Daniel Shiffman example 
// https://github.com/shiffman/The-Nature-of-Code-Examples/tree/master/chp03_oscillation/NOC_3_09_exercise_additive_wave

 
var xspacing = 0.5;   // How far apart should each horizontal position be spaced
var w;              // Width of entire wave
var maxwaves = 2;   // total # of waves to add together

var theta = 0.0;
var amplitude = [];   // Height of wave
var dx = [];          // Value for incrementing X, to be calculated as a function of period and xspacing
var yvalues = [];                           // Using an array to store height values for the wave (not entirely necessary)

function setup() {
  createCanvas(1820,540);
  //colorMode(RGB, 255, 255, 255, 100);
  w = width + 16;

  for (var i = 0; i < maxwaves; i++) {
    amplitude.push(random(100, 400));
    var period = random(500,800); // How many pixels before the wave repeats
    dx.push((TWO_PI / period) * xspacing/2);
  }
  //console.log(amplitude, dx);

  yvalues = [];
}

function draw() {
  background(0);
  calcWave();
  renderWave();
  stroke(255);
  text(frameRate(), 0,0, 100,100);
}

function calcWave() {
  // Increment theta (try different values for 'angular velocity' here
  theta += 0.1;

  // Set all height values to zero
  for (var i = 0; i < amplitude.length; i++) {
    yvalues.push(0);
  }
 
  // Accumulate wave height values
  for (var j = 0; j < maxwaves; j++) {
    var x = theta;
    for (var i = 0; i < yvalues.length; i++) {
      // Every other wave is cosine instead of sine
      if (j % 2 == 0)  yvalues[i] += sin(x)*amplitude[j];
      else yvalues[i] += cos(x)*amplitude[j];
      x+=dx[j];
    }
  }
}

function renderWave() {
  // A simple way to draw the wave with an ellipse at each position
  noStroke();
  fill(255);
  stroke(255);
  ellipseMode(CENTER);
  for (var x = 0; x < yvalues.length; x++) {
    ellipse(x*xspacing,height/2+yvalues[x],4,16);
  }
}