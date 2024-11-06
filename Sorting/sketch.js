let items = [];
let labels = [];
let score = 0;
let level = 1;
let totalLevels = 3;
let backButton;

function setup() {
  createCanvas(800, 600);
  initializeGame();

  // Back button setup
  backButton = createButton('Back');
  backButton.position(20, 550);
  backButton.mousePressed(previousLevel);
}

function draw() {
  background(230, 240, 255);

  // Display the title of the game
  fill(0);
  textSize(24);
  textAlign(CENTER, TOP);
  text("Sorting Game", width / 2, 20);

  // Draw labels with different colors
  for (let label of labels) {
    fill(label.color);
    rect(label.x, label.y, label.w, label.h, 10);
    fill(0);
    textAlign(CENTER, CENTER);
    text(label.name, label.x + label.w / 2, label.y + label.h / 2);
  }

  // Draw and update items
  for (let item of items) {
    item.update();
    item.display();
  }

  // Display score and level
  fill(50);
  textSize(18);
  textAlign(LEFT, TOP);
  text(`Score: ${score}`, 20, 20);
  text(`Level: ${level}`, 20, 50);

  // Check if all items are correctly placed to move to the next level
  if (checkNextLevel()) {
    if (level < totalLevels) {
      level++;
      initializeGame();
    } else {
      background(255);
      fill(0);
      textSize(36);
      textAlign(CENTER, CENTER);
      text('Congratulations! You completed all levels!', width / 2, height / 2);
      noLoop();
    }
  }
}

function initializeGame() {
  items = [];
  labels = [];
  score = 0;

  labels = [
    { name: 'Coin', x: 50, y: 500, w: 100, h: 50, color: color(255, 204, 0) },
    { name: 'Toys', x: 200, y: 500, w: 100, h: 50, color: color(102, 204, 255) },
    { name: 'Vegetables', x: 350, y: 500, w: 100, h: 50, color: color(144, 238, 144) },
    { name: 'Food', x: 500, y: 500, w: 100, h: 50, color: color(255, 99, 71) }
  ];

  items = [
    new DraggableItem('Piggy Bank', random(50, 700), random(100, 400), 'Coin'),
    new DraggableItem('Cash', random(50, 700), random(100, 400), 'Coin'),
    new DraggableItem('Stuffed Animal', random(50, 700), random(100, 400), 'Toys'),
    new DraggableItem('Fake Car', random(50, 700), random(100, 400), 'Toys'),
    new DraggableItem('Doll', random(50, 700), random(100, 400), 'Toys'),
    new DraggableItem('Broccoli', random(50, 700), random(100, 400), 'Vegetables'),
    new DraggableItem('Carrot', random(50, 700), random(100, 400), 'Vegetables'),
    new DraggableItem('Pizza', random(50, 700), random(100, 400), 'Food'),
    new DraggableItem('Donut', random(50, 700), random(100, 400), 'Food'),
    new DraggableItem('Bread', random(50, 700), random(100, 400), 'Food')
  ];
}

function checkNextLevel() {
  return items.every(item => item.isPlaced);
}

class DraggableItem {
  constructor(name, x, y, targetLabel) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.w = 50;
    this.h = 50;
    this.color = color(random(255), random(255), random(255));
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.targetLabel = targetLabel;
    this.isPlaced = false;
  }

  pressed() {
    if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  released() {
    if (!this.dragging) return;  // Only proceed if item was actually dragged
    this.dragging = false;

    // Check if the item is dropped in the correct label
    for (let label of labels) {
      if (
        this.targetLabel === label.name &&
        mouseX > label.x && mouseX < label.x + label.w &&
        mouseY > label.y && mouseY < label.y + label.h
      ) {
        // Position the item in the center of the label
        this.x = label.x + (label.w - this.w) / 2;
        this.y = label.y + (label.h - this.h) / 2;
        
        // Award score only if it hasn't been placed correctly before
        if (!this.isPlaced) {
          score += 1;
          this.isPlaced = true; // Mark only this item as placed to avoid scoring again
        }
        return;
      }
    }
  }

  update() {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }

  display() {
    fill(this.color);
    rect(this.x, this.y, this.w, this.h, 10);
    fill(0);
    textAlign(CENTER, CENTER);
    text(this.name, this.x + this.w / 2, this.y + this.h / 2);
  }
}

function previousLevel() {
  if (level > 1) {
    level--;
    initializeGame();
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
