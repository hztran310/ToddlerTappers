let gameImages = [
    { id: 'homepage_toybox', img: null, x: 0.1, y: 0.85, scale: 1.2 },
    { id: 'homepage_bricktoy', img: null, x: 0.9, y: 0.9, scale: 1.4 },
    { id: 'homepage_puzzle', img: null, x: 0.95, y: 0.4, scale: 1 },
    { id: 'homepage_plane', img: null, x: 0.25, y: 0.15, scale: 0.6 },
    { id: 'homepage1', img: null, x: 0.5, y: 0.24, scale: 1.5 },
];

function preload() {
    gameImages.forEach(imageObj => {
        let imgElement = document.getElementById(imageObj.id);
        if (imgElement) {
            imageObj.img = loadImage(imgElement.src);
        }
    });
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    setupButtons();
}

function setupButtons() {
    select('#closeButton').mousePressed(() => window.close());
    select('#settingButton').mousePressed(() => alert('Settings button pressed!'));
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    background(220);
    fill(233, 255, 206);
    rect(0, 0, windowWidth, windowHeight);

    gameImages.forEach(drawImage);
}

function drawImage(imgObj) {
    if (imgObj.img) {
        let posX = imgObj.x * windowWidth;
        let posY = imgObj.y * windowHeight;
        let imgWidth = imgObj.img.width * imgObj.scale;
        let imgHeight = imgObj.img.height * imgObj.scale;
        image(imgObj.img, posX - imgWidth / 2, posY - imgHeight / 2, imgWidth, imgHeight);
    }
}
