function setup() {
    createCanvas(windowWidth, windowHeight);
    setupButtons();
}

function setupButtons() {
    // Directly attach event listeners to the buttons
    const closeButton = select('#closeButton');
    const settingButton = select('#settingButton');
    const playButton = select('#playButton');
    const sortingButton = document.getElementById('sorting');
    const bubbleButton = document.getElementById('bubble');
    const homeButton = document.getElementById('gamemenu_homeButton');

    if (sortingButton) {
        bubbleButton.mousePressed(() => window.location.href = 'Sorting/index.html');
    }

    if (bubbleButton) {
        bubbleButton.mousePressed(() => window.location.href = 'Bubble/index.html');
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
    if (reloadButton) {
        reloadButton.mousePressed(() => resetGame()); // Call resetGame on click
    }

    if (homeButton) {
        homeButton.mousePressed(() => window.location.href = 'homepage.html');
    }


}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(233, 255, 206); // Background color
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

    if (score > 0) {
        starContainer.appendChild(createStarElement());
    }
    if (score > 3) {
        starContainer.appendChild(createStarElement());
    }
    if (score > 7) {
        starContainer.appendChild(createStarElement());
    }
}
