let items = [];
let labels = [];
let score = 0;
let level = 1;  // Keep track of levels
let totalLevels = 3; // Number of levels in the game

function setup() {
  createCanvas(600, 400);  // Smaller display
  initializeGame();
}

function draw() {
  background(230, 240, 255);  // Light background color

  // Draw labels with different colors
  for (let label of labels) {
    fill(label.color);
    rect(label.x, label.y, label.w, label.h, 10);  // Rounded corners for labels
    fill(0);
    textAlign(CENTER, CENTER);
    text(label.name, label.x + label.w / 2, label.y + label.h / 2);
  }
  
  // Draw and update items
  for (let item of items) {
    item.update();
    item.display();
  }
  
  // Display score and level with clear visibility
  fill(50);
  textSize(18);
  textAlign(LEFT, TOP);
  text(`Score: ${score}`, 20, 20);
  text(`Level: ${level}`, 20, 50);
  
  // Check if all items are correctly placed to move to next level
  if (checkNextLevel()) {
    if (level < totalLevels) {
      level++;
      initializeGame();  // Reinitialize the game for the next level
    } else {
      // All levels complete, show win message
      background(255);
      fill(0);
      textSize(36);
      textAlign(CENTER, CENTER);
      text('Congratulations! You completed all levels!', width / 2, height / 2);
      noLoop(); // Stop the game loop
    }
  }
}

// Initialize game for the current level
function initializeGame() {
  // Reset items and labels for new level
  items = [];
  labels = [];
  score = 0;
  
  // Define the labels and their corresponding sections with colors
  labels = [
    { name: 'Coin', x: 50, y: 300, w: 100, h: 50, color: color(255, 204, 0) },  // Yellow for "Coin"
    { name: 'Toys', x: 200, y: 300, w: 100, h: 50, color: color(102, 204, 255) },  // Blue for "Toys"
    { name: 'Vegetables', x: 350, y: 300, w: 100, h: 50, color: color(144, 238, 144) },  // Light green for "Vegetables"
    { name: 'Pizza', x: 500, y: 300, w: 100, h: 50, color: color(255, 99, 71) },  // Red for "Pizza"
    // Add more labels and colors for future levels
  ];
  
  // Define the items and their initial positions (you can add more items as levels progress)
  items = [
    new DraggableItem('Coin', 100, 100, 'Coin', color(255, 204, 0)),  // Yellow Coin
    new DraggableItem('Toys', 150, 100, 'Toys', color(102, 204, 255)),  // Blue Toys
    new DraggableItem('Broccoli', 200, 100, 'Vegetables', color(144, 238, 144)),  // Green Broccoli
    new DraggableItem('Pizza', 250, 100, 'Pizza', color(255, 99, 71)),  // Red Pizza
    // Add more items as needed for more complexity in higher levels
  ];
}

// Check if all items have been placed correctly
function checkNextLevel() {
  for (let item of items) {
    if (!item.isPlaced) {
      return false;  // If any item is not placed, don't proceed to next level
    }
  }
  return true;  // All items placed correctly
}

class DraggableItem {
  constructor(name, x, y, targetLabel, color) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 50;
    this.color = color;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.targetLabel = targetLabel;
    this.isPlaced = false;
  }
  
  // Check if the item is being clicked
  pressed() {
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }
  
  // Release the item when the mouse is released
  released() {
    this.dragging = false;
    
    // Check if the item is dropped in the correct label
    for (let label of labels) {
      if (this.targetLabel === label.name && 
          mouseX > label.x && mouseX < label.x + label.w && 
          mouseY > label.y && mouseY < label.y + label.h) {
        this.x = label.x + (label.w - this.w) / 2;
        this.y = label.y + (label.h - this.h) / 2;
        if (!this.isPlaced) {
          score += 1;  // Add points when item is correctly placed
          this.isPlaced = true;
        }
        return;
      }
    }
  }
  
  // Update the position of the item if it is being dragged
  update() {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }
  
  // Display the item with its color
  display() {
    fill(this.color);
    rect(this.x, this.y, this.w, this.h, 10);  // Rounded corners for items
    fill(0);
    textAlign(CENTER, CENTER);
    text(this.name, this.x + this.w / 2, this.y + this.h / 2);
  }
}

function mousePressed() {
  for (let item of items) {
    item.pressed();
  }
}

function mouseReleased() {
  for (let item of items) {
    item.released();
  }
}
