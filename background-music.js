let audioContext;
let backgroundMusicBuffer;
let backgroundMusicSource;
let isMusicPlaying = false;

// Function to load background music
async function loadBackgroundMusic(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    backgroundMusicBuffer = await audioContext.decodeAudioData(arrayBuffer);
}

// Function to play background music
function playBackgroundMusic() {
    // Ensure the audio context is resumed after user interaction
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            startMusicPlayback();
        });
    } else {
        startMusicPlayback();
    }
}

// Function to start music playback
function startMusicPlayback() {
    if (backgroundMusicBuffer) {
        backgroundMusicSource = audioContext.createBufferSource();
        backgroundMusicSource.buffer = backgroundMusicBuffer;
        backgroundMusicSource.loop = true;
        backgroundMusicSource.connect(audioContext.destination);
        backgroundMusicSource.start(0);
        isMusicPlaying = true;
        sessionStorage.setItem('backgroundMusicPlaying', 'true');  // Persist state across pages
    } else {
        console.error('Background music buffer is not loaded.');
    }
}

// Function to stop background music
function stopBackgroundMusic() {
    if (backgroundMusicSource) {
        backgroundMusicSource.stop();
        isMusicPlaying = false;
        sessionStorage.setItem('backgroundMusicPlaying', 'false');  // Persist state across pages
    }
}

// Load background music when the page loads
document.addEventListener('DOMContentLoaded', (event) => {
    // Add click listener to start audio context only when user clicks
    if (!audioContext) {
        document.addEventListener('click', startAudioContextOnce);
    }
});

function startAudioContextOnce() {
    // Create the AudioContext after the user click
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Load the background music once the AudioContext is available
    loadBackgroundMusic('sound/background-music.mp3').then(() => {
        // If the music is not already playing, add a click listener to start it
        if (sessionStorage.getItem('backgroundMusicPlaying') !== 'true') {
            playBackgroundMusic();
        }
    });

    // Remove the click listener after the first user gesture
    document.removeEventListener('click', startAudioContextOnce);
}

function playBackgroundMusicOnce() {
    playBackgroundMusic();
    // After playing the music, update the sessionStorage and remove the event listener
    sessionStorage.setItem('backgroundMusicPlaying', 'true');
    document.removeEventListener('click', playBackgroundMusicOnce);
}
