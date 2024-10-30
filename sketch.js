function setup() {
    createCanvas(windowWidth, windowHeight);
    setupButtons();
}

function setupButtons() {
    // Directly attach event listeners to the buttons
    const closeButton = select('#closeButton');
    const settingButton = select('#settingButton');
    const playButton = select('#playButton');
    const bubbleButton = document.getElementById('bubble');

    if (bubbleButton) {
        bubbleButton.mousePressed(() => window.location.href = 'Sorting/index.html');
    }

    if (closeButton) {
        closeButton.mousePressed(() => window.close());
    }

    if (settingButton) {
        settingButton.mousePressed(() => alert('Settings button pressed!'));
    }

    if (playButton) {
        playButton.mousePressed(() => window.location.href = 'game-menu.html');
    }


}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function drawCenterRectangle() {
    fill(255, 249, 120); // Yellow color for the rectangle
    noStroke();
    let rectWidth = 50;
    let rectHeight = 30;
    let cornerRadius = 20;

    rectMode(CENTER);
    rect(100, 200, rectWidth, rectHeight, cornerRadius);
}

function draw() {
    background(233, 255, 206); // Background color

    if (document.body.id === "resultPage") {
        fill(255, 0, 0); // Red color for the rectangle
        noStroke();
        rectMode(CENTER);
        rect(windowWidth / 2, windowHeight / 2, 100, 50); // Draw rectangle directly here
    }
}

document.addEventListener('DOMContentLoaded', (event) => {
    if (document.body.id === "resultPage") {
        drawStars(10); // Example score, you can set this dynamically
    }
});

//

function createStarElement() {
    const star = document.createElement('img');
    star.src = 'images/star.png'; // Path to your star image
    star.classList.add('star');
    return star;
}

function drawStars(score) {
    const starContainer = document.getElementById('starContainer');

    if (score > 3) {
        starContainer.appendChild(createStarElement());
    }
    if (score > 5) {
        starContainer.appendChild(createStarElement());
    }
    if (score > 7) {
        starContainer.appendChild(createStarElement());
    }
}
