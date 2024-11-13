let bubbles = [];
let popSound;
let bubbleCount = 0;       // Bubble counter
let timer = 5;            // Game time in seconds
let highScore = 0;         // To store the highest score
let gameActive = true;     // To control when the game is active
let endTime = 0;           // To track when the game ends and redirect

function preload() {
  popSound = loadSound('bubble.mp3');

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  highScore = localStorage.getItem('highScore_Bubble') ? parseInt(localStorage.getItem('highScore')) : 0;
  
  // Start by generating some initial bubbles
  for (let i = 0; i < 10; i++) {
    createBubble();
  }
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(233, 255, 206);  

  fill(0);
  textSize(100);
  textAlign(CENTER, CENTER); // Center the text horizontally and vertically

  if (gameActive) {
    text(`Time Left: ${timer}`, width / 2, 650);
    
    // Update timer and check if game is over
    if (millis() - endTime >= 1000 && timer > 0) {
      endTime = millis();
      timer--;
    }

    if (timer <= 0 && gameActive) {
      gameActive = false;  // Stop the game when the timer runs out
      
      if (isNaN(bubbleCount)) bubbleCount = 0;
      
      let currentHighScore = max(highScore, bubbleCount);  // Update high score if necessary

      localStorage.setItem('finalScore', bubbleCount);
      if (currentHighScore > highScore) {
        localStorage.setItem('highScore_Bubble', currentHighScore);
      }

      // At the end of the game, set the game type in localStorage
      localStorage.setItem('currentGame', 'Bubble');


      setTimeout(() => {
        window.location.href = '../result.html';  // Redirect to result page after 3 seconds
      });
    }

    // Update and display all bubbles
    for (let i = bubbles.length - 1; i >= 0; i--) {
      bubbles[i].move();
      bubbles[i].show();
      
      // Remove bubbles if they go off the screen
      if (bubbles[i].offScreen()) {
        bubbles.splice(i, 1);
        createBubble();  // Create a new bubble to replace it
      }
    }
    
    // Generate new bubbles periodically
    if (frameCount % 60 == 0) {
      createBubble();
    }
  } 
}

function mousePressed() {
  if (gameActive) {
    // Check if any bubbles are clicked (popped)
    for (let i = bubbles.length - 1; i >= 0; i--) {
      if (bubbles[i].isPopped(mouseX, mouseY)) {
        popSound.play();
        bubbles.splice(i, 1);  // Remove popped bubble
        bubbleCount++;         // Increase bubble counter
        createBubble();        // Add a new bubble after popping
      }
    }
  }
}

// Helper function to create a new bubble with vibrant colors and transparency
function createBubble() {
  let x = random(width);
  let y = height + random(50, 100); // Start slightly off-screen at the bottom
  let r = random(60, 120);  // Random size for bubbles
  
  // Color palette with vibrant colors and slight transparency
  let colors = [
    color(50, 100, 255, 180),  // Deep blue
    color(255, 50, 150, 180),  // Vibrant pink-red
    color(100, 200, 50, 180),  // Deep green
    color(150, 50, 255, 180),  // Purple
    color(255, 200, 50, 180)   // Orange-yellow
  ];
  
  let c = random(colors); // Randomly select a color
  bubbles.push(new Bubble(x, y, r, c));
}

// Bubble class with simple smiley face
class Bubble {
  constructor(x, y, r, c) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = c;
    this.xSpeed = random(-1, 1);
    this.ySpeed = random(-1, -2.5); // Slightly slower float
  }

  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Bounce off the edges
    if (this.x + this.r > width || this.x - this.r < 0) {
      this.xSpeed *= -1;
    }
  }

  show() {
    noStroke();
    
    // Bubble with color fill
    fill(this.color);
    ellipse(this.x, this.y, this.r * 2);
    
    // Smiley face
    fill(0);  // Black color for eyes and mouth
    ellipse(this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.2);  // Left eye
    ellipse(this.x + this.r * 0.3, this.y - this.r * 0.3, this.r * 0.2);  // Right eye
    arc(this.x, this.y + this.r * 0.2, this.r * 0.6, this.r * 0.4, 0, PI);  // Smiling mouth
  }

  isPopped(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.r;
  }

  offScreen() {
    return this.y + this.r < 0;
  }
}
