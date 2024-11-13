let items = [];
let labels = [];
let score = 0;
let level = 1;
let totalLevels = 3;
let backButton;
let piggyBankImg, toysImg, foodImg;
let coinImg, brocolliImg, pizzaImg, lemonadeImg, donutImg;
let robotImg, carImg, dollImg, brickImg;
let correctStreakCount = 0;

function preload() {
  piggyBankImg = loadImage('../images/piggy-bank.png');
  toysImg = loadImage('../images/toy-sorting.png');
  foodImg = loadImage('../images/food-basket.png');
  coinImg = loadImage('../images/coin.png');
  brocolliImg = loadImage('../images/broccoli.png');
  pizzaImg = loadImage('../images/pizza.png');
  lemonadeImg = loadImage('../images/lemonade.png');
  donutImg = loadImage('../images/donut.png');
  brickImg = loadImage('../images/brick.png');
  carImg = loadImage('../images/car.png');
  dollImg = loadImage('../images/doll.png');
  robotImg = loadImage('../images/robot.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  initializeGame();

  highScore = localStorage.getItem('highScore_Sorting') ? parseInt(localStorage.getItem('highScore_Sorting')) : 0;
}

function draw() {
  background(233, 255, 206); 

  // Display the title of the game
  fill(0);
  textSize(24);
  textAlign(CENTER, TOP);

  // Draw labels with different colors
  for (let label of labels) {
    image(label.img, label.x, label.y, label.w, label.h);
  }

  // Draw and update items
  for (let item of items) {
    item.update();
    item.display();
  }

  // Display score and level
  document.getElementById('score').innerHTML = `${score}`;
  document.getElementById('level_text').innerHTML = `Level: ${level}`;

  // Check if all items are correctly placed to move to the next level
  if (checkNextLevel()) {
    score += calculateLevelBonus();
    if (level < totalLevels) {
      level++;
      initializeGame();
    } else {
      background(233, 255, 206); 
      fill(0);
      textSize(36);
      textAlign(CENTER, CENTER);
      text('Congratulations! You completed all levels!', width / 2, height / 2);
      noLoop();

    }
  }
}

function initializeGame() {
  if (level === 1) {
    score = 0;
  }

  items = [];
  labels = [
    { name: 'Piggy Bank', x: 700, y: 1450, w: 900, h: 900, img: piggyBankImg },
    { name: 'Toys', x: 1700, y: 1450, w: 900, h: 900, img: toysImg },
    { name: 'Food', x: 2650, y: 1450, w: 900, h: 900, img: foodImg }
  ];

  // Define all available items
  const allItems = [
    new DraggableItem('Fake Car', random(50, windowWidth - 700), random(600, 1000), 1000, 800, 'Toys', carImg),
    new DraggableItem('Doll', random(50, windowWidth - 700), random(600, 1000), 1000, 800, 'Toys', dollImg),
    new DraggableItem('Broccoli', random(50, windowWidth - 700), random(600, 1100), 800, 600, 'Food', brocolliImg),
    new DraggableItem('Pizza', random(50, windowWidth - 700), random(600, 1100), 800, 600, 'Food', pizzaImg),
    new DraggableItem('Donut', random(50, windowWidth - 700), random(600, 1100), 800, 600, 'Food', donutImg),
    new DraggableItem('Lemonade', random(50, windowWidth - 700), random(600, 1100), 800, 600, 'Food', lemonadeImg),
    new DraggableItem('Robot', random(50, windowWidth - 700), random(600, 1100), 800, 600, 'Toys', robotImg),
    new DraggableItem('Brick', random(50, windowWidth - 700), random(600, 1100), 800, 600, 'Toys', brickImg)
  ];

  let numItemTypes;
  if (level === 1) {
    numItemTypes = 3;
  } else if (level === 2) {
    numItemTypes = 5;
  } else if (level === 3) {
    numItemTypes = allItems.length;
  }

  const selectedItemTypes = shuffle(allItems).slice(0, numItemTypes);
  const numCoins = floor(random(1, 5));
  
  for (let i = 0; i < numCoins; i++) {
    items.push(new DraggableItem('Coin', random(50, windowWidth - 700), random(600, 1100), 400, 400, 'Piggy Bank', coinImg));
  }
  
  for (let item of selectedItemTypes) {
    items.push(item);
  }

  for (let item of items) {
    item.visible = true; // Set all items to visible
  }
}

function calculateLevelBonus()
{
  let baseBonus = 50;
  let streakBonus = 10 * correctStreakCount;

  return baseBonus + streakBonus;
}

function checkNextLevel() {
  return items.every(item => item.isPlaced);
}

class DraggableItem {
  constructor(name, x, y, w, h, targetLabel, img = null) {
    this.name = name;
    this.startX = x;  // Save original x position
    this.startY = y;  // Save original y position
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.targetLabel = targetLabel;
    this.isPlaced = false;
    this.img = img; // Add image property
    this.visible = true; // Add visible property
  }

  pressed() {
    if (this.visible && this.img && mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
      return true; // Indicate that this item is being dragged
    }
    return false; // Indicate that this item is not being dragged
  }

  released() {
    if (!this.dragging) return;
    this.dragging = false;

    // Check if the item is dropped in the correct label
    let placedCorrectly = false;
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
          score += 10;
          correctStreakCount++;
          this.isPlaced = true;
          this.visible = false; // Set visible to false
        }
        placedCorrectly = true;
        break;
      }
    }

    // If not placed correctly, return to the original position
    if (!placedCorrectly) {
      correctStreakCount = 0;
      this.x = this.startX;
      this.y = this.startY;
    }
  }

  update() {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }

  display() {
    if (!this.visible) return; // Skip drawing if not visible

    if (this.img) {
      image(this.img, this.x, this.y, this.w, this.h); // Draw the image with specified width and height
    } else {
      fill(this.color);
      rect(this.x, this.y, this.w, this.h, 10);
      fill(0);
      textAlign(CENTER, CENTER);
      text(this.name, this.x + this.w / 2, this.y + this.h / 2);
    }
  }
}

function previousLevel() {
  if (level > 1) {
    level--;
    initializeGame();
  }
}

function mousePressed() {
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].pressed()) {
      break; // Stop checking other items once one is selected
    }
  }
}

function mouseReleased() {
  for (let item of items) {
    item.released();
  }
}