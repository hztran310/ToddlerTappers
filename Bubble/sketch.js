let bubbles = [];
let popSound;
let bubbleCount = 0;       // Bubble counter
let timer = 30;            // Game time in seconds
let highScore = 0;         // To store the highest score
let gameActive = true;     // To control when the game is active

function preload() {
  popSound = loadSound('bubble.mp3');
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  
  // Start by generating some initial bubbles
  for (let i = 0; i < 10; i++) {
    createBubble();
  }
}

function draw() {
  background(0);  // Black background
  
  // Display only the timer during gameplay
  fill(255);
  textSize(24);
  if (gameActive) {
    text(`Time Left: ${timer}`, width / 2, 30);
    
    // Update timer and check if game is over
    if (frameCount % 60 == 0) {  // Decrease timer every second
      timer--;
      if (timer <= 0) {
        gameActive = false;  // Stop the game when the timer runs out
        highScore = max(highScore, bubbleCount);  // Update high score if necessary
      }
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
  } else {
    // Display game over message with final stats
    textSize(32);
    text("Game Over!", width / 2, height / 2 - 40);
    textSize(24);
    text(`Bubbles Popped: ${bubbleCount}`, width / 2, height / 2);
    text(`High Score: ${highScore}`, width / 2, height / 2 + 40);
    text("Press 'R' to Restart", width / 2, height / 2 + 80);
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

function keyPressed() {
  // Reset the game if 'R' is pressed
  if (key === 'R' || key === 'r') {
    resetGame();
  }
}

// Helper function to create a new bubble with vibrant colors and transparency
function createBubble() {
  let x = random(width);
  let y = height + random(50, 100); // Start slightly off-screen at the bottom
  let r = random(30, 60);  // Random size for bubbles
  
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

// Reset the game
function resetGame() {
  bubbleCount = 0;
  timer = 30;
  gameActive = true;
  bubbles = [];
  for (let i = 0; i < 10; i++) {
    createBubble();
  }
}

// Bubble class with enhanced shiny appearance
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
    
    // Bubble with soft gradient-like fill
    fill(this.color);
    ellipse(this.x, this.y, this.r * 2);
    
    // Add a shiny highlight effect
    fill(255, 255, 255, 180);
    ellipse(this.x - this.r * 0.2, this.y - this.r * 0.2, this.r * 0.4);
    
    // Additional small highlight
    fill(255, 255, 255, 120);
    ellipse(this.x + this.r * 0.15, this.y + this.r * 0.15, this.r * 0.2);
  }

  isPopped(px, py) {
    let d = dist(px, py, this.x, this.y);
    return d < this.r;
  }

  offScreen() {
    return this.y + this.r < 0;
  }
}
