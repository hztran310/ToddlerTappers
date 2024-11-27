let startSound;

function setup() {
    createCanvas(windowWidth, windowHeight);
    setupButtons();

    startSound = loadSound('sounds/start.mp3');
}

function setupButtons() {
    // Directly attach event listeners to the buttons
    const closeButton = select('#closeButton');
    const settingButton = select('#settingButton');
    const playButton = select('#playButton');
    const homeButton = document.getElementById('gamemenu_homeButton');

    if (closeButton) {
        closeButton.mousePressed(() => window.close());
    }

    if (settingButton) {
        settingButton.mousePressed(() => alert('Settings button pressed!'));
    }

    if (playButton) {
        playButton.mousePressed(() => {
            // Play the sound
            if (startSound) {
                startSound.play();
            }

            document.body.classList.add('fade-out');
    
            // Add a delay before transitioning to the new page
            setTimeout(() => {
                window.location.href = 'game-menu.html';
            }, 1000); // 1000ms = 1 second delay
        });
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
