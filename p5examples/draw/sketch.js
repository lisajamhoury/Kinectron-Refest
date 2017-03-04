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

var processing = false;

// Declare Kinectron
var kinectron1 = null;
var kinectron2 = null;

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

}

function draw() {
  if (overlap1 && overlap2) {
   console.log('ues');
   background(random(255), random(255), random(255)); 
  } else { 
    background(255,1);
  }

  // fill(255,0,0,100);
  // rect(860,0,100,540);

  if (image1Loaded) { 
    image(image1,0,0);
    var ol1 = image1.get(760,0,200, 540);
    if (ol1.canvas) { 
      ol1.loadPixels();
      overlap1 = checkOverlap(ol1.pixels);
    } 
}
  if (image2Loaded) { image(image2, 760,0);
    var ol2 = image2.get(0,0,200, 540);
    if (ol2.canvas) { 
      ol2.loadPixels();
      overlap2 = checkOverlap(ol2.pixels);
    }
  
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
  image1 = loadImage(img.src);
  //image1.src = img.src;
}

function loadImg2(img) {
  if (!image2Loaded) image2Loaded = true;
  image2 = loadImage(img.src);

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
