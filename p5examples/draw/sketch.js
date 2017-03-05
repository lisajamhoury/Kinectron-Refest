// Run with simplehttpserver for image to load properly. http://www.andyjamesdavies.com/blog/javascript/simple-http-server-on-mac-os-x-in-seconds

var myCanvas = null;
var beach;
var image1;
var image2;
var image1Loaded = false;
var overlap1 = false;
var overlap2 = false;
var image2Loaded = false;
var img;
var myDiv;
var image2XOffset = 460;

var processing = false;

// Declare Kinectron
var kinectron1 = null;
var kinectron2 = null;

var joints1 = null;
var joints2 = null;

var feetTouching = false;
var handsTouching = false;
var flashBackground = false;

function preload() {
  //beach = loadImage("images/beach.png");
}

// window.addEventListener('load', function() {
//   image2 = document.getElementById("image2");
//   image1 = document.getElementById("image1");
// });

function setup() {
  myCanvas = createCanvas(1820, 540);
  background(255);

  // Define and create an instance of kinectron
  var kinectronIpAddress1 = "172.16.221.132"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron1 = new Kinectron(kinectronIpAddress1);

  var kinectronIpAddress2 = "172.16.237.47"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron2 = new Kinectron(kinectronIpAddress2);

  // Connect to the microstudio
  //kinectron = new Kinectron("kinectron.itp.tsoa.nyu.edu");

  // Create connection between remote and application
  kinectron1.makeConnection();
  kinectron2.makeConnection();

  // Start the greenscreen camera
  kinectron1.startKey(loadImg1);
  kinectron2.startKey(loadImg2);

  kinectron1.setMultiFrameCallback(mfcb1);
  kinectron2.setMultiFrameCallback(mfcb2);

  // FOR SIN BACKGROUND
  w = width + 16;

  for (var i = 0; i < maxwaves; i++) {
    amplitude.push(random(100, 400));
    var period = random(500,800); // How many pixels before the wave repeats
    dx.push((TWO_PI / period) * xspacing/2);
  }
  //console.log(amplitude, dx);

  yvalues = [];


}

function mfcb1(data) {
  //console.log(data.img);
  //debugger;
  loadImg1(data.img);
  joints1 = data.joints;

  //draw left hand 
  // drawHand(data.leftHand);
  // drawHand(data.rightHand);
  // fill(255,0,0);
  // var adjustedX = data.joints[11].colorX * 960;
  // var adjustedY = data.joints[11].colorY * 540;
  // ellipse(adjustedX, adjustedY, 50, 50);

}

function mfcb2(data) {
  //console.log(data.img);
  //debugger;
  loadImg2(data.img);
  joints2 = data.joints;

  //draw left hand 
  // drawHand(data.leftHand);
  // drawHand(data.rightHand);
  // fill(0,255,0);
  // var adjustedX = image2XOffset + (data.joints[11].colorX * 960); // offset image x
  // var adjustedY = data.joints[11].colorY * 540;
  // ellipse(adjustedX, adjustedY, 50, 50);

}

function draw() {
  if (feetTouching) {
    background(random(255), random(255), random(255)); 
  } else if (handsTouching) {
    sinBackground();
  } else { 
    background(255,1);
  }

  // fill(255,0,0,100);
  // rect(860,0,100,540);



  if (joints1 && joints2) {
    //check hands and feet
    handsTouching = checkLandR(7, 11);
    feetTouching = checkLandR(15, 19);
  }

  if (image1Loaded) image(image1,0,0);

  if (image2Loaded) image(image2, image2XOffset,0);

}

function checkLandR(left, right) {
    var p1L = getJointLocation(joints1[left], 0);
    var p2L = getJointLocation(joints2[left], image2XOffset);

    var p1R = getJointLocation(joints1[right], 0);
    var p2R = getJointLocation(joints2[right], image2XOffset);

    var col1 = checkCollisions(p1L, p2L);
    var col2 = checkCollisions(p1L, p2R);
    var col3 = checkCollisions(p1R, p2L);
    var col4 = checkCollisions(p1R, p2R);

    // console.log(col1, col2, col3, col4);
  
    if (col1 || col2 || col3 || col4) {
      return true;
    } else { 
      return false;
    }



}

function getJointLocation(joint, xOffset) {
  var newJoint = {};
  newJoint.x = xOffset + (joint.colorX * 960); // offset image x
  newJoint.y = joint.colorY * 540;
  fill(255,0,0);
  //ellipse(newJoint.x, newJoint.y, 50, 50);
  //text(newJoint.x, newJoint.x, newJoint.y, 30,30);
  return newJoint;
}

function checkCollisions(j1, j2) {
  var diffX = Math.abs(j1.x - j2.x);
  var diffY = Math.abs(j1.y - j2.y);
  if ( (diffX < 100) && (diffY < 100)) {
    return true;
  } else {
    return false;
  }

}

function checkOverlap(pixels, img) {
  for (var i = 0; i < pixels.length; i+=4) {
    if (pixels[i] > 0) {
      return true;
    }
  }
  return false;
}

function loadImg1(img) {
  //console.log(img);
  //debugger;
  if (!image1Loaded) image1Loaded = true;
  image1 = loadImage(img);
  //image1.src = img.src;
}

function loadImg2(img) {
  if (!image2Loaded) image2Loaded = true;
  image2 = loadImage(img);

  //image2.src = img.src;
  //image2 = loadImage(img.src);
  //image2.src = img;

}

function keyPressed() {
  if (keyCode === ENTER) {
    kinectron1.stopAll();
    kinectron2.stopAll();
  } 
  
}


var xspacing = 0.5;   // How far apart should each horizontal position be spaced
var w;              // Width of entire wave
var maxwaves = 2;   // total # of waves to add together

var theta = 0.0;
var amplitude = [];   // Height of wave
var dx = [];          // Value for incrementing X, to be calculated as a function of period and xspacing
var yvalues = [];

function sinBackground () {
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
