// ----=  Image Variables  =----
let bgImage;
let villageImage;
let villageFireImage;
let dragonBody;
let dragonBackImage;
let dragonMouthImage;
let dragonTopImage;
let dragonFireImage;
// ----=  Image Character Variables  =----
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
  // ----=  Image Uploading  =----
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
  for (let i = 0; i < faces.length; i++) {
    let face = faces[i];
    if (showKeypoints) drawPoints(face);

    // ----=  Face Variables  =----
    let faceCenterX = face.faceOval.centerX;
    let faceCenterY = face.faceOval.centerY;

    // Facial measurements
    let leftCheek = face.keypoints[234];
    let rightCheek = face.keypoints[454];
    let faceWidth = dist(leftCheek.x, leftCheek.y, rightCheek.x, rightCheek.y);

    let upperLip = face.keypoints[13];
    let lowerLip = face.keypoints[14];
    lipDistance = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y); // Tracking the distance between top lip and bottom lip
    let mouthOffset = map(lipDistance, 0, 30, 0, 50); // For the dragons mouth image to move in relation to lipDistance
    let fireOpacity = map(lipDistance, 0, 25, 0, 255); // Tracking the lipDistance in terms of the dragons fire opacity

    push();
    imageMode(CENTER);

    // Dragon body (aligned to face)
    let bodyHeight = faceWidth * 2;
    let bodyY = faceCenterY + bodyHeight / 2;
    image(dragonBodyImage, faceCenterX, bodyY, faceWidth * 2, bodyHeight);

    // ----=  Layering the Dragon parts images  =----
    image(dragonBackImage, faceCenterX, faceCenterY - 100, faceWidth * 2, faceWidth * 2);
    image(dragonMouthImage, faceCenterX, faceCenterY - 100 + mouthOffset, faceWidth * 2, faceWidth * 2);

    // Draw the village
    village(face);

    // Fire effect when mouth opens
    push();
    tint(255, fireOpacity); //Controlling the opacity of the Dragons fire
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
  // ----=  Creating varaibles for the villagers to come back to life  =----
  let leftHandPresent = false;
  let rightHandPresent = false;
  
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

    // Setting up the face variables for the fingers
    if (faces.length === 0) continue;
    let face = faces[0];
    let mouth = face.mouth;

    // -------- Left Hand --------
    if (handType === "Left") {
      leftHandPresent = true;
      // Tracking the finger to the mouth distance for when the villagers get eaten
      checkMouthCollision(indexX, indexY, 'farmer', mouth); 
      checkMouthCollision(pinkyX, pinkyY, 'kid', mouth);

      // Farmer (index) and Kid (pinky)
      farmerPuppet(indexX, indexY);
      kidPuppet(pinkyX, pinkyY);
    }

    // -------- Right Hand --------
    if (handType === "Right") {
      rightHandPresent = true;
      // Tracking the finger to the mouth distance for when the villagers get eaten
      checkMouthCollision(indexX, indexY, 'chef', mouth);
      checkMouthCollision(pinkyX, pinkyY, 'maiden', mouth);

      // Chef (index) and Maiden (pinky)
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
  let distToMouth = dist(fx, fy, mouth.x, mouth.y); // Distance between chosen finger to the mouth
  if (lipDistance > 15 && distToMouth < mouth.size / 2) { // If finger and mouth come into contact the villager dies
    if (character === 'farmer') farmerDead = true;
    if (character === 'chef') chefDead = true;
    if (character === 'maiden') maidenDead = true;
    if (character === 'kid') kidDead = true;
  }
}

function farmerPuppet(x, y) {
  push();
  imageMode(CENTER);

  if (farmerDead) { // If farmerDead variable is true
    image(farmerDeadImage, x, y, 280 / 3, 716 / 3);
  } else if (lipDistance > 5) { // If mouth is open the villager on fire
    image(farmerFireImage, x, y, 280 / 3, 716 / 3);
  } else {
    image(farmerImage, x, y, 280 / 3, 716 / 3); // normal villager
  }

  pop();
}
function chefPuppet(x, y) {
  push();
  imageMode(CENTER);

  if (chefDead) { // If chefDead variable is true
    image(chefDeadImage, x, y, 318 / 3, 752  / 3); 
  } else if (lipDistance > 5) { // If mouth is open the villager on fire
    image(chefFireImage, x, y, 318 / 3, 752  / 3);
  } else {
    image(chefImage, x, y, 318 / 3, 752  / 3); // normal villager
  }

  pop();
}
function maidenPuppet(x, y) {
  push();
  imageMode(CENTER);

  if (maidenDead) { // If maidenDead variable is true
    image(maidenDeadImage, x, y, 301 / 3, 741 / 3);
  } else if (lipDistance > 5) {
    image(maidenFireImage, x, y, 301 / 3, 741 / 3); // If mouth is open the villager on fire
  } else {
    image(maidenImage, x, y, 301 / 3, 741 / 3); // normal villager
  }

  pop();
}
function kidPuppet(x, y) {
  push();
  imageMode(CENTER);

  if (kidDead) { // If kidDead variable is true
    image(kidDeadImage, x, y, 188 / 3, 465 / 3);
  } else if (lipDistance > 5) {
    image(kidFireImage, x, y, 188 / 3, 465 / 3); // If mouth is open the villager on fire
  } else {
    image(kidImage, x, y, 188 / 3, 465 / 3); // normal villager
  }

  pop();
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
// ----=  Controlling the village image for when its on fire  =----
function village(face) { 
  let upperLip = face.keypoints[13]
  let lowerLip = face.keypoints[14]

  let d = dist (upperLip.x, upperLip.y,lowerLip.x, lowerLip.y) // Tracking distance from lips 
  
  let fireOpacity = map(d, 0, 35, 0, 255); // Tracking the lipDistance in terms of the villages fire opacity
  fireOpacity = constrain(fireOpacity, 0, 255); // safety

  // Draw the normal village
  image(villageImage, width/2, height/2, width, height);

  // Apply tint *only* to the fire image
  push();
  tint(255, fireOpacity);
  image(villageFireImage, width/2, height/2, width, height);
  pop(); // reset tint
}