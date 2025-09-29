// ----=  Faces  =----
/* load images here */
let bgImage;
bgImage = loadImage('/images/background.png');
  image(bgImage, 200, 200)

function prepareInteraction() {

}
s
function drawInteraction(faces, hands) {
  // for loop to capture if there is more than one face on the screen. This applies the same process to all faces. 
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i]; // face holds all the keypoints of the face\
    console.log(face);
    if (showKeypoints) {
      drawPoints(face)
    }

    /*
    Once this program has a face, it knows some things about it.
    This includes how to draw a box around the face, and an oval. 
    It also knows where the key points of the following parts are:
     face.leftEye
     face.leftEyebrow
     face.lips
     face.rightEye
     face.rightEyebrow
    */
    // Here are some variables you may like to use. 
    // Face basics
    let faceCenterX = face.faceOval.centerX;
    let faceCenterY = face.faceOval.centerY;
    let faceWidth = face.faceOval.width;
    let faceheight = face.faceOval.height;
    // Left eye
    let leftEyeCenterX = face.leftEye.centerX;
    let leftEyeCenterY = face.leftEye.centerY;
    let leftEyeWidth = face.leftEye.width;
    let leftEyeHeight = face.leftEye.height;
    // Left eyebrow
    let leftEyebrowCenterX = face.leftEyebrow.centerX;
    let leftEyebrowCenterY = face.leftEyebrow.centerY;
    let leftEyebrowWidth = face.leftEyebrow.width;
    let leftEyebrowHeight = face.leftEyebrow.height;

    // Lips
    let lipsCenterX = face.lips.centerX;
    let lipsCenterY = face.lips.centerY;
    let lipsWidth = face.lips.width;
    let lipsHeight = face.lips.height;

    // Right eye
    let rightEyeCenterX = face.rightEye.centerX;
    let rightEyeCenterY = face.rightEye.centerY;
    let rightEyeWidth = face.rightEye.width;
    let rightEyeHeight = face.rightEye.height;

    // Right eyebrow
    let rightEyebrowCenterX = face.rightEyebrow.centerX;
    let rightEyebrowCenterY = face.rightEyebrow.centerY;
    let rightEyebrowWidth = face.rightEyebrow.width;
    let rightEyebrowHeight = face.rightEyebrow.height;

    let noseTipX = face.keypoints[4].x;
    let noseTipY = face.keypoints[4].y;

    
    /*
    Start drawing on the face here
    */
    
    leftEye(face);
    rightEye(face);
    mouth(face);
    // fill(get(leftEyeCenterX, leftEyeCenterY))

    //ellipse(leftEyeCenterX, leftEyeCenterY, leftEyeWidth, leftEyeHeight);

  

    //drawPoints(face.leftEye);
    //drawPoints(face.leftEyebrow);
    //drawPoints(face.lips);
    //drawPoints(face.rightEye);
    //drawPoints(face.rightEyebrow);

    //drawX(rightEyeCenterX,rightEyeCenterY);
    //drawX(leftEyeCenterX,leftEyeCenterY);
   // drawEyes(rightEyeCenterX,rightEyeCenterY,rightEyeHeight);
    //drawEyes(leftEyeCenterX,leftEyeCenterY,leftEyeHeight*3);
    //drawEyebrows(rightEyebrowCenterX,rightEyebrowCenterY);
    //drawEyebrows(leftEyebrowCenterX,leftEyebrowCenterY-15);
    openMouth(face)
    //drawX(noseTipX,noseTipY); 

    //drawX(face.keypoints[332].x,face.keypoints[332].y);
    //drawX(face.keypoints[103].x,face.keypoints[103].y);


    /*
    Stop drawing on the face here
    */

  }
  //------------------------------------------------------
  // You can make addtional elements here, but keep the face drawing inside the for loop. 
}
function leftEye(face) {
  let leftEyeValues = [33, 246, 161, 160, 159, 158, 157, 133, 155, 154, 153, 145, 144, 163, 7];

  fill(255, 255, 255);
  beginShape();
  for (let i = 0; i < leftEyeValues.length; i++) {
    let pt = face.keypoints[leftEyeValues[i]];
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);
}

function rightEye(face) {
  let rightEyeValues = [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382];

  fill(255, 255, 255);
  beginShape();
  for (let i = 0; i < rightEyeValues.length; i++) {
    let pt = face.keypoints[rightEyeValues[i]];
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);
}

function mouth(face) {
  let mouthValues = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];

  fill(255, 255, 255);
  beginShape();
  for (let i = 0; i < mouthValues.length; i++) {
    let pt = face.keypoints[mouthValues[i]];
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE); 

}


function drawEyebrows(X, Y) {
  fill(0)
  push()
  rectMode(CENTER);
  rect(X,Y,80, 20)

  pop()
}
function drawX(X, Y) {
  push()
  stroke(0);
  strokeWeight(15)
  line(X - 20, Y - 20, X + 20, Y + 20)
  line(X - 20, Y + 20, X + 20, Y - 20)

  pop()
}
// This function draw's a dot on all the keypoints. It can be passed a whole face, or part of one. 
function drawPoints(feature) {

  push()
  for (let i = 0; i < feature.keypoints.length; i++) {
    let element = feature.keypoints[i];
    noStroke();
    fill(0, 255, 0);
    circle(element.x, element.y, 5);
  }
  pop()

}



function openMouth(face) { 
  let isMouthOpen = true;
  let upperLip = face.keypoints[13]
  let lowerLip = face.keypoints[14]

  let d = dist (upperLip.x, upperLip.y,lowerLip.x, lowerLip.y)
  if (d<10) {
    isMouthOpen = false
  } else {
    isMouthOpen = true
  }
  if (isMouthOpen === true) {
    text("hello world", upperLip.x, upperLip.y);
  } else{
    return
  }
}