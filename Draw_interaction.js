// ----=  HANDS  =----
let bgImage;
let villageImage;
let villageFireImage;
let dragonBody;
let dragonBackImage;
let dragonMouthImage;
let dragonTopImage;
let dragonFireImage;

function prepareInteraction() {
  bgImage = loadImage('/images/background.png');
  villageImage = loadImage('/images/village.png')
  villageFireImage = loadImage('/images/villagefire.png')
  dragonBodyImage = loadImage('/images/dragonbody.png')
  dragonBackImage = loadImage('/images/dragonback.png')
  dragonMouthImage = loadImage('/images/dragonmouth.png')
  dragonTopImage = loadImage('/images/dragontop.png')
  dragonFireImage = loadImage('/images/dragonfire.png')
}

function drawInteraction(faces, hands) {
  image(bgImage, 0, 0, width, height)

  // hands part
  // USING THE GESTURE DETECTORS (check their values in the debug menu)
  // detectHandGesture(hand) returns "Pinch", "Peace", "Thumbs Up", "Pointing", "Open Palm", or "Fist"

  //------------------------------------------------------------
  //facePart
  // for loop to capture if there is more than one face on the screen. This applies the same process to all faces. 
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i]; // face holds all the keypoints of the face\
    console.log(face);
    if (showKeypoints) {
      drawPoints(face)
    }
    noStroke();
    let faceCenterX = face.faceOval.centerX;
    let faceCenterY = face.faceOval.centerY;

    let leftCheek = face.keypoints[234];
    let rightCheek = face.keypoints[454];
    let faceWidth = dist(leftCheek.x, leftCheek.y, rightCheek.x, rightCheek.y);
    
    let upperLip = face.keypoints[13];
    let lowerLip = face.keypoints[14];
    let lipDistance = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);
    let mouthOffset = map(lipDistance, 0, 30, 0, 50);
    let fireOpacity = map(lipDistance, 0, 25, 0, 255);

    

    push();
    imageMode(CENTER);

    // make dragon body start at centre of head (top edge aligns with face centre)
    let bodyHeight = faceWidth * 2;
    let bodyY = faceCenterY + bodyHeight / 2; // shifts body down so top is at face centre

    image(dragonBodyImage, faceCenterX, bodyY, faceWidth * 2, bodyHeight);

    // rest of dragon parts
    image(dragonBackImage, faceCenterX, faceCenterY - 100, faceWidth * 2, faceWidth * 2);
    image(dragonMouthImage, faceCenterX, faceCenterY - 100 + mouthOffset, faceWidth * 2, faceWidth * 2);

    village(face);

    push();
    tint(255, fireOpacity);
    image(dragonFireImage, faceCenterX, faceCenterY + 100, faceWidth * 2, faceWidth * 2);
    pop();
    
    image(dragonTopImage, faceCenterX, faceCenterY - 100, faceWidth * 2, faceWidth * 2);

    pop();


    /*
    Stop drawing on the face here
    */

  }

  // for loop to capture if there is more than one hand on the screen. This applies the same process to all hands.
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    if (showKeypoints) {
      drawPoints(hand)
      drawConnections(hand)
    }
    // console.log(hand);
    let indexFingerTipX = hand.index_finger_tip.x;
    let indexFingerTipY = hand.index_finger_tip.y;
    /*
    Start drawing on the hands here
    */

    // call puppet
    drawPuppet(indexFingerTipX, indexFingerTipY);

    /*
    Stop drawing on the hands here
    */
  }
  function drawPuppet(x, y) {
    push();
    noStroke();
    // body
    fill(200, 150, 255);
    ellipse(x, y + 40, 60, 80);
    // head
    fill(255, 220, 180);
    ellipse(x, y, 50, 50);
    // eyes
    fill(0);
    ellipse(x - 10, y - 5, 8, 8);
    ellipse(x + 10, y - 5, 8, 8);
    // mouth
    noFill();
    stroke(0);
    strokeWeight(3);
    arc(x, y + 5, 20, 15, 0, PI);
    pop();
}
  //------------------------------------------------------
  // You can make addtional elements here, but keep the face drawing inside the for loop. 
}
function leftEye(face, colour) {
  let leftEyeValues = [33, 246, 161, 160, 159, 158, 157, 133, 155, 154, 153, 145, 144, 163, 7];

  fill(colour);
  beginShape();
  for (let i = 0; i < leftEyeValues.length; i++) {
    let pt = face.keypoints[leftEyeValues[i]];
    vertex(pt.x, pt.y);
  }
  endShape(CLOSE);
}

function rightEye(face, colour) {
  let rightEyeValues = [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382];

  fill(colour);
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

function village(face) { 
  let isMouthOpen = true;
  let upperLip = face.keypoints[13]
  let lowerLip = face.keypoints[14]

  let d = dist (upperLip.x, upperLip.y,lowerLip.x, lowerLip.y)
  
  let fireOpacity = map(d, 0, 35, 0, 255);
  fireOpacity = constrain(fireOpacity, 0, 255); // safety

  // Draw the normal village
  image(villageImage, width/2, height/2, width, height);

  // Apply tint *only* to the fire image
  push();
  tint(255, fireOpacity);
  image(villageFireImage, width/2, height/2, width, height);
  pop(); // reset tint
}