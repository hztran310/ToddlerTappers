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
let correctSound;
let incorrectSound;
let highScore = 0;


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
  correctSound = loadSound('../sounds/correct.mp3');
  incorrectSound = loadSound('../sounds/invalid_sorting.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  initializeGame();

  audioContext = getAudioContext();

  highScore = localStorage.getItem('highScore_Sorting');

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
    if (level < totalLevels) {
      level++;
      initializeGame();
    } else {
      // Display the game over screen
      localStorage.setItem('currentGame', 'Sorting');
      localStorage.setItem('finalScore', score);
      if (score > highScore) {
        localStorage.setItem('highScore_Sorting', score);
      }
      setTimeout(() => {
        window.location.href = '../result.html'; 
      });
    }
  }
}

function initializeGame() {
  if (level === 1) {
    score = 0;
  }

  items = [];
  labels = [
    { name: 'Piggy Bank', x: windowWidth * 0.15, y: windowHeight * 0.6, w: windowWidth * 0.2, h: windowWidth * 0.2, img: piggyBankImg },
    { name: 'Toys', x: windowWidth * 0.4, y: windowHeight * 0.6, w: windowWidth * 0.2, h: windowWidth * 0.2, img: toysImg },
    { name: 'Food', x: windowWidth * 0.65, y: windowHeight * 0.6, w: windowWidth * 0.2, h: windowWidth * 0.2, img: foodImg }
  ];

  // Define all available items
  const allItems = [
    new DraggableItem('Fake Car', random(windowWidth * 0.05, windowWidth * 0.95 - windowWidth * 0.2), random(windowHeight * 0.2, windowHeight * 0.5), windowWidth * 0.25, windowHeight * 0.21, 'Toys', carImg),
    new DraggableItem('Doll', random(windowWidth * 0.05, windowWidth * 0.95 - windowWidth * 0.2), random(windowHeight * 0.2, windowHeight * 0.4), windowWidth * 0.3, windowHeight * 0.3, 'Toys', dollImg),
    new DraggableItem('Broccoli', random(windowWidth * 0.05, windowWidth * 0.45 - windowWidth * 0.35), random(windowHeight * 0.1, windowHeight * 0.45), windowWidth * 0.15, windowWidth * 0.2, 'Food', brocolliImg),
    new DraggableItem('Pizza', random(windowWidth * 0.05, windowWidth * 0.95 - windowWidth * 0.15), random(windowHeight * 0.2, windowHeight * 0.5), windowWidth * 0.15, windowHeight * 0.15, 'Food', pizzaImg),
    new DraggableItem('Donut', random(windowWidth * 0.05, windowWidth * 0.95 - windowWidth * 0.15), random(windowHeight * 0.2, windowHeight * 0.5), windowWidth * 0.18, windowHeight * 0.18, 'Food', donutImg),
    new DraggableItem('Lemonade', random(windowWidth * 0.05, windowWidth * 0.95 - windowWidth * 0.15), random(windowHeight * 0.1, windowHeight * 0.5), windowWidth * 0.2, windowHeight * 0.25, 'Food', lemonadeImg),
    new DraggableItem('Robot', random(windowWidth * 0.05, windowWidth * 0.95 - windowWidth * 0.15), random(windowHeight * 0.2, windowHeight * 0.38), windowWidth * 0.35, windowHeight * 0.35, 'Toys', robotImg),
    new DraggableItem('Brick', random(windowWidth * 0.05, windowWidth * 0.95 - windowWidth * 0.15), random(windowHeight * 0.1, windowHeight * 0.5), windowWidth * 0.15, windowHeight * 0.15, 'Toys', brickImg)
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
    items.push(new DraggableItem('Coin', random(windowWidth * 0.05, windowWidth * 0.95 - windowWidth * 0.1), random(windowHeight * 0.2, windowHeight * 0.5), windowWidth * 0.1, windowWidth * 0.1, 'Piggy Bank', coinImg));
  }
  
  for (let item of selectedItemTypes) {
    items.push(item);
  }

  for (let item of items) {
    item.visible = true; // Set all items to visible
  }
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
          correctSound.play();
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
      incorrectSound.play();
      score -= 5;
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