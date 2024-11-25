let audioContext;
let backgroundMusicBuffer;
let backgroundMusicSource;
let isMusicPlaying = false;

// Preload background music
function preloadBackgroundMusic(url) {
    console.log("Preloading background music from:", url);
    const audio = new Audio(url);
    audio.preload = 'auto'; // Ensure it is preloaded
    audio.oncanplaythrough = () => {
        console.log('Music preloaded successfully');
    };
    audio.onerror = (e) => {
        console.error('Error preloading music:', e);
    };
}

// Function to load background music
async function loadBackgroundMusic(url) {
    console.log("Attempting to load background music from:", url);
    try {
        // Fetch the audio file
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Failed to load audio file: ' + response.statusText);
            return;
        }

        // Convert the audio file into an ArrayBuffer
        console.log("Audio file fetched successfully. Decoding...");
        const arrayBuffer = await response.arrayBuffer();

        // Create a new AudioContext if it doesn't exist
        if (!audioContext) {
            console.log("Creating new AudioContext...");
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }

        // Decode the audio data
        backgroundMusicBuffer = await audioContext.decodeAudioData(arrayBuffer);
        console.log("Background music decoded successfully.");
    } catch (error) {
        console.error("Error loading or decoding background music:", error);
    }
}

// Function to play background music
function playBackgroundMusic() {
    console.log("Attempting to play background music...");
    if (audioContext.state === 'suspended') {
        console.log("AudioContext suspended, resuming...");
        audioContext.resume().then(() => {
            startMusicPlayback();
        });
    } else {
        startMusicPlayback();
    }
}

// Function to start music playback
function startMusicPlayback() {
    if (backgroundMusicBuffer && !isMusicPlaying) {
        console.log("Starting music playback...");
        backgroundMusicSource = audioContext.createBufferSource();
        backgroundMusicSource.buffer = backgroundMusicBuffer;
        backgroundMusicSource.loop = true;
        backgroundMusicSource.connect(audioContext.destination);
        backgroundMusicSource.start(0);
        isMusicPlaying = true;
        localStorage.setItem('backgroundMusicPlaying', 'true');
        console.log("Music started.");
    } else {
        console.error('Background music buffer is not loaded or already playing.');
    }
}

// Function to stop background music
function stopBackgroundMusic() {
    if (backgroundMusicSource) {
        console.log("Stopping background music...");
        backgroundMusicSource.stop();
        isMusicPlaying = false;
        localStorage.setItem('backgroundMusicPlaying', 'false');
        console.log("Music stopped.");
    }
}

// Load background music when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOMContentLoaded event triggered.");

    // Start preloading the music as soon as possible
    preloadBackgroundMusic('sound/background-music.mp3');  // Ensure the path is correct

    // Initialize the audio context and buffer only once
    if (!audioContext) {
        loadBackgroundMusic('sound/background-music.mp3');  // Ensure the path is correct
    }

    // If the music is not already playing, add a click listener to start it
    if (localStorage.getItem('backgroundMusicPlaying') !== 'true') {
        console.log("Waiting for message to start music...");
        window.addEventListener('message', (event) => {
            console.log("Message received: ", event.data);
            if (event.data === 'startMusic') {
                playBackgroundMusic();
            }
        });
    }
});

// Persist state when navigating
window.addEventListener('beforeunload', () => {
    console.log("Saving background music state...");
    localStorage.setItem('backgroundMusicPlaying', isMusicPlaying ? 'true' : 'false');
});
