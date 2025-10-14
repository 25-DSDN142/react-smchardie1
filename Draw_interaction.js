// ----=  Image Variables  =----
let bgImage;
let villageImage;
let villageFireImage;
let dragonBody;
let dragonBackImage;
let dragonMouthImage;
let dragonTopImage;
let dragonFireImage;
let farmerImage, farmerFireImage, farmerDeadImage;
let chefImage, chefFireImage, chefDeadImage;
let maidenImage, maidenFireImage, maidenDeadImage;
let kidImage, kidFireImage, kidDeadImage;

// ----= State Variables =----
let lipDistance = 0;
let farmerDead = false; 
let chefDead = false;
let maidenDead = false;
let kidDead = false;

function prepareInteraction() {
  // Background
  bgImage = loadImage('/images/background.png');
  // Village
  villageImage = loadImage('/images/village.png')
  villageFireImage = loadImage('/images/villagefire.png')
  // Dragon
  dragonBodyImage = loadImage('/images/dragonbody.png')
  dragonBackImage = loadImage('/images/dragonback.png')
  dragonMouthImage = loadImage('/images/dragonmouth.png')
  dragonTopImage = loadImage('/images/dragontop.png')
  dragonFireImage = loadImage('/images/dragonfire.png')
  // Farmer
  farmerImage = loadImage('/images/farmer.png');
  farmerFireImage = loadImage('/images/farmerfire.png');
  farmerDeadImage = loadImage('/images/farmerdead.png');

  // Chef
  chefImage = loadImage('/images/chef.png');
  chefFireImage = loadImage('/images/cheffire.png');
  chefDeadImage = loadImage('/images/chefdead.png');

  // Maiden
  maidenImage = loadImage('/images/maiden.png');
  maidenFireImage = loadImage('/images/maidenfire.png');
  maidenDeadImage = loadImage('/images/maidendead.png');

  // Kid
  kidImage = loadImage('/images/kid.png');
  kidFireImage = loadImage('/images/kidfire.png');
  kidDeadImage = loadImage('/images/kiddead.png');
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
    let face = faces[i];
    if (showKeypoints) drawPoints(face);

    let faceCenterX = face.faceOval.centerX;
    let faceCenterY = face.faceOval.centerY;

    // Facial measurements
    let leftCheek = face.keypoints[234];
    let rightCheek = face.keypoints[454];
    let faceWidth = dist(leftCheek.x, leftCheek.y, rightCheek.x, rightCheek.y);

    let upperLip = face.keypoints[13];
    let lowerLip = face.keypoints[14];
    lipDistance = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);
    let mouthOffset = map(lipDistance, 0, 30, 0, 50);
    let fireOpacity = map(lipDistance, 0, 25, 0, 255);

    push();
    imageMode(CENTER);

    // Dragon body (aligned to face)
    let bodyHeight = faceWidth * 2;
    let bodyY = faceCenterY + bodyHeight / 2;
    image(dragonBodyImage, faceCenterX, bodyY, faceWidth * 2, bodyHeight);

    // Dragon parts
    image(dragonBackImage, faceCenterX, faceCenterY - 100, faceWidth * 2, faceWidth * 2);
    image(dragonMouthImage, faceCenterX, faceCenterY - 100 + mouthOffset, faceWidth * 2, faceWidth * 2);

    // Draw the village
    village(face);

    // Fire effect when mouth opens
    push();
    tint(255, fireOpacity);
    image(dragonFireImage, faceCenterX, faceCenterY + 100, faceWidth * 2, faceWidth * 2);
    pop();

    image(dragonTopImage, faceCenterX, faceCenterY - 100, faceWidth * 2, faceWidth * 2);
    pop();

    // Save mouth position for collision detection
    face.mouth = { x: faceCenterX, y: faceCenterY - 60, size: faceWidth };
  


    /*
    Stop drawing on the face here
    */

  }
  let leftHandPresent = false;
  let rightHandPresent = false;
  // for loop to capture if there is more than one hand on the screen. This applies the same process to all hands.
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    let handType = hand.handedness; // "Left" or "Right"

    if (showKeypoints) {
      drawPoints(hand);
      drawConnections(hand);
    }

    // Get the finger tip coordinates
    let indexX = hand.index_finger_tip.x;
    let indexY = hand.index_finger_tip.y;
    let pinkyX = hand.pinky_finger_tip.x;
    let pinkyY = hand.pinky_finger_tip.y;

    if (faces.length === 0) continue;
    let face = faces[0];
    let mouth = face.mouth;

    // -------- Left Hand --------
    if (handType === "Left") {
      leftHandPresent = true;
      // Farmer (index) and Kid (pinky)
      checkMouthCollision(indexX, indexY, 'farmer', mouth);
      checkMouthCollision(pinkyX, pinkyY, 'kid', mouth);

      farmerPuppet(indexX, indexY);
      kidPuppet(pinkyX, pinkyY);
    }

    // -------- Right Hand --------
    if (handType === "Right") {
      rightHandPresent = true;
      // Chef (index) and Maiden (pinky)
      checkMouthCollision(indexX, indexY, 'chef', mouth);
      checkMouthCollision(pinkyX, pinkyY, 'maiden', mouth);

      chefPuppet(indexX, indexY);
      maidenPuppet(pinkyX, pinkyY);
    }
  }
  // Revive characters if hands go off-screen
  if (!leftHandPresent) {
    farmerDead = false;
    kidDead = false;
  }
  if (!rightHandPresent) {
    chefDead = false;
    maidenDead = false;
  }
}
// ---------------- Check if finger is in mouth ----------------
function checkMouthCollision(fx, fy, character, mouth) {
  let distToMouth = dist(fx, fy, mouth.x, mouth.y);
  if (lipDistance > 15 && distToMouth < mouth.size / 2) {
    if (character === 'farmer') farmerDead = true;
    if (character === 'chef') chefDead = true;
    if (character === 'maiden') maidenDead = true;
    if (character === 'kid') kidDead = true;
  }
}

function farmerPuppet(x, y) {
  push();
  imageMode(CENTER);

  if (farmerDead) {
    image(farmerDeadImage, x, y, 280 / 3, 716 / 3);
  } else if (lipDistance > 5) {
    image(farmerFireImage, x, y, 280 / 3, 716 / 3);
  } else {
    image(farmerImage, x, y, 280 / 3, 716 / 3);
  }

  pop();
}
function chefPuppet(x, y) {
  push();
  imageMode(CENTER);

  if (chefDead) {
    image(chefDeadImage, x, y, 318 / 3, 752  / 3);
  } else if (lipDistance > 5) {
    image(chefFireImage, x, y, 318 / 3, 752  / 3);
  } else {
    image(chefImage, x, y, 318 / 3, 752  / 3);
  }

  pop();
}
function maidenPuppet(x, y) {
  push();
  imageMode(CENTER);

  if (maidenDead) {
    image(maidenDeadImage, x, y, 301 / 3, 741 / 3);
  } else if (lipDistance > 5) {
    image(maidenFireImage, x, y, 301 / 3, 741 / 3);
  } else {
    image(maidenImage, x, y, 301 / 3, 741 / 3);
  }

  pop();
}
function kidPuppet(x, y) {
  push();
  imageMode(CENTER);

  if (kidDead) {
    image(kidDeadImage, x, y, 188 / 3, 465 / 3);
  } else if (lipDistance > 5) {
    image(kidFireImage, x, y, 188 / 3, 465 / 3);
  } else {
    image(kidImage, x, y, 188 / 3, 465 / 3);
  }

  pop();
}
  //------------------------------------------------------
  // You can make addtional elements here, but keep the face drawing inside the for loop. 
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