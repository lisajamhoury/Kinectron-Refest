// Run with simplehttpserver for image to load properly. http://www.andyjamesdavies.com/blog/javascript/simple-http-server-on-mac-os-x-in-seconds

var myCanvas = null;
var beach;
var image1;
var image2;
//var image2Loaded = false;
var img;
var myDiv;

var processing = false;

// Declare Kinectron
var kinectron1 = null;
var kinectron2 = null;

function preload() {
  //beach = loadImage("images/beach.png");
}

window.addEventListener('load', function() {
  image2 = document.getElementById("image2");
  image1 = document.getElementById("image1");
});

function setup() {
  myCanvas = createCanvas(640, 426);
  background(255);

  // Define and create an instance of kinectron
  var kinectronIpAddress1 = "10.0.1.14"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
  kinectron1 = new Kinectron(kinectronIpAddress1);

  var kinectronIpAddress2 = "10.0.1.16"; // FILL IN YOUR KINECTRON IP ADDRESS HERE
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
  //gotoBeach();
}

//function goToBeach(img) {
  // loadImage(img.src, function(loadedImage) {
  //   image(beach, 0, 0);
  //   image(loadedImage, 0, 0);
  //   //image(image2, 0,0);
  // });
//}

function loadImg1(img) {
  image1.src = img.src;
}

function loadImg2(img) {
  image2.src = img.src;
  //image2 = loadImage(img.src);
  //image2.src = img;

}

function keyPressed() {
  if (keyCode === ENTER) {
    kinectron1.stopAll();
    kinectron2.stopAll();
  } 
}