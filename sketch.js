function setup() {
    createCanvas(windowWidth, windowHeight);
    setupButtons();
}

function setupButtons() {
    select('#closeButton').mousePressed(() => window.close());
    select('#settingButton').mousePressed(() => alert('Settings button pressed!'));
    select('#playButton').mousePressed(() => {
        window.location.href = 'game-menu.html';
    });
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    fill(233, 255, 206);
    rect(0, 0, windowWidth, windowHeight);
}
