// ----=  HANDS  =----
function prepareInteraction() {
  //bgImage = loadImage('/images/background.png');
}

function drawInteraction(faces, hands) {

  // hands part
  // USING THE GESTURE DETECTORS (check their values in the debug menu)
  // detectHandGesture(hand) returns "Pinch", "Peace", "Thumbs Up", "Pointing", "Open Palm", or "Fist"

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
    let upperLip = face.keypoints[13];
    let lowerLip = face.keypoints[14];
    let lipDistance = dist(upperLip.x, upperLip.y, lowerLip.x, lowerLip.y);
    
    let c1 = color(255, 255, 255); // white
    let c2 = color(255, 0, 0);     // red
    let amt = map(lipDistance, 0, 80, 0, 1);
    let eyeColour = lerpColor(c1, c2, amt);

    leftEye(face, eyeColour);
    rightEye(face, eyeColour);
    mouth(face);
    /*
    Stop drawing on the face here
    */

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

