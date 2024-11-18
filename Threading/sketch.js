let beads = [];
let threads = {};           // Stores paths for each color
let currentColor = null;     // Tracks the color of the thread currently being connected
let nextLevel = false;
let dragging = false;
let draggedBead = null;
let lastConnectedBead = null; // Tracks the last connected bead in the current sequence
let colors = ["red", "blue", "green", "yellow", "purple"];
let score = 0;
let highScore = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    generateBeads();

    highScore = localStorage.getItem('highScore_Threading');
}

function draw() {
    background(233, 255, 206); 

    // Draw beads
    for (let bead of beads) {
        fill(bead.color);
        ellipse(bead.x, bead.y, bead.r * 2);
    }

    // Draw threads for each color
    strokeWeight(4);
    for (let color in threads) {
        stroke(color);
        noFill();
        beginShape();
        for (let point of threads[color]) {
            vertex(point.x, point.y);
        }
        endShape();
    }

    // Draw line from dragged bead to mouse if dragging
    if (dragging && draggedBead) {
        stroke(draggedBead.color);
        line(draggedBead.x, draggedBead.y, mouseX, mouseY);
    }

    document.getElementById('score').innerHTML = `${score}`;

    // Check if all beads are connected
    if (checkIfAllBeadsConnected()) {
        nextLevel = true;
        displayEndMessage();
    }
}

function checkIfAllBeadsConnected() {
    // Check if all beads are connected
    for (let bead of beads) {
        if (!bead.connected) {
            return false; // If any bead is not connected, return false
        }
    }
    return true; // All beads are connected
}

function mousePressed() {

    if (document.getElementById('buttonContainer')) return;

    if (nextLevel) {
        resetGame();
        return;
    }

    // Start dragging if the mouse is over the last connected bead or an unconnected bead of the current color
    for (let bead of beads) {
        if (dist(mouseX, mouseY, bead.x, bead.y) < bead.r) {
            // If no color is currently selected, start a new color thread from this bead
            if (currentColor === null && !bead.connected) {
                currentColor = bead.color;
                lastConnectedBead = bead;
                dragging = true;
                draggedBead = bead;
                break;
            }

            // Allow dragging only if the bead matches the current color and is the last connected bead
            if (bead.color === currentColor && bead === lastConnectedBead) {
                dragging = true;
                draggedBead = bead;
                break;
            }
        }
    }
}

function mouseReleased() {
    if (dragging && draggedBead) {
        // Find a bead to connect to that matches the color and is not yet connected
        for (let bead of beads) {
            if (bead !== draggedBead && !bead.connected && bead.color === currentColor &&
                dist(mouseX, mouseY, bead.x, bead.y) < bead.r) {

                // Connect the beads and update connection status
                bead.connected = true;
                draggedBead.connected = true;

                // Initialize or add to the thread for this color
                if (!threads[currentColor]) {
                    threads[currentColor] = [];
                }
                threads[currentColor].push({ x: draggedBead.x, y: draggedBead.y });
                threads[currentColor].push({ x: bead.x, y: bead.y });

                // Update the last connected bead to the newly connected bead
                lastConnectedBead = bead;

                score += 10;

                // If all beads of this color are connected, reset for the next color
                if (beads.filter(b => b.color === currentColor && b.connected).length === beads.filter(b => b.color === currentColor).length) {
                    currentColor = null;   // Unlock to allow starting a new color thread
                    lastConnectedBead = null;
                }

                // Stop dragging
                dragging = false;
                draggedBead = null;
                return;
            }
        }

        // If no valid connection was made, stop dragging without connecting
        dragging = false;
        draggedBead = null;
    }
}

function generateBeads() {
    beads = [];
    threads = {};
    currentColor = null;
    lastConnectedBead = null;
    let minDistance = 60;  // Minimum distance to prevent overlapping
    let numPairs = 4;      // 4 pairs of each color for a total of 20 beads (5 colors)

    for (let color of colors) {
        for (let i = 0; i < numPairs; i++) {
            let newBead;
            let isValidPosition = false;

            // Attempt to place the bead without overlapping
            while (!isValidPosition) {
                newBead = {
                    x: random(400, windowWidth - 200),
                    y: random(500, windowHeight - 200),
                    r: 40,
                    color: color,
                    connected: false
                };
                isValidPosition = true;

                // Ensure no overlapping with previously placed beads
                for (let bead of beads) {
                    if (dist(newBead.x, newBead.y, bead.x, bead.y) < minDistance + newBead.r) {
                        isValidPosition = false;
                        break;
                    }
                }
            }
            beads.push(newBead);
        }
    }
}

function displayEndMessage() {
    clear();
    background(233, 255, 206);

    // Check if container already exists to avoid duplicates
    if (document.getElementById('buttonContainer')) return;

    // Create a container for buttons
    let buttonContainer = document.createElement('div');
    buttonContainer.id = 'buttonContainer';
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.left = '50%';
    buttonContainer.style.top = '60%';
    buttonContainer.style.transform = 'translate(-50%, -50%)';
    buttonContainer.style.textAlign = 'center';

    // Create "Continue" button
    let continueButton = document.createElement('img');
    continueButton.src = '../images/continue_button.png'; // Path to your image
    continueButton.alt = 'Continue';
    continueButton.style.width = '500px';
    continueButton.style.height = '250px';
    continueButton.style.margin = '10px';
    continueButton.style.cursor = 'pointer';
    continueButton.classList.add('button'); // Add CSS class


    // Create "Stop" button
    let stopButton = document.createElement('img');
    stopButton.src = '../images/stop_button.png'; // Path to your image
    stopButton.alt = 'Stop';
    stopButton.style.width = '500px';
    stopButton.style.height = '250px';
    stopButton.style.margin = '10px';
    stopButton.style.cursor = 'pointer';
    stopButton.classList.add('button'); // Add CSS class


    // Add buttons to the container
    buttonContainer.appendChild(continueButton);
    buttonContainer.appendChild(stopButton);
    document.body.appendChild(buttonContainer);

    // Add click events
    continueButton.addEventListener('click', () => {
        nextLevel = false;
        document.body.removeChild(buttonContainer);
        generateBeads();
    });

    stopButton.addEventListener('click', () => {
        localStorage.setItem('finalScore', score);
        localStorage.setItem('currentGame', 'Threading');
        if (score > highScore) {
            localStorage.setItem('highScore_Threading', score);
        }
        window.location.href = '../result.html';
    });
}

function resetGame() {
    for (let bead of beads) {
        bead.connected = false;
    }
    threads = {};
    nextLevel = false;
    generateBeads();
}