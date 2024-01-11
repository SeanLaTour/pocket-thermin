import * as Tone from 'tone'
import * as handTrack from 'handtrackjs';
import "../styles/styles.css";
import "../styles/loadingIcon.css";
const synth = new Tone.Synth({
    oscillator: {
      type: "sine",
    },
    envelope: {
        attack: 0.1,  // Short attack for smooth onset
        decay: 0.2,  // Short decay for a legato-like feel
        sustain: 0.5,
        release: 1,
      },
      portamento: 2,
  }).toDestination();
const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");
let isVideo = false;
let model = null;
let prevNote = "";
let isSynthPlaying = false;
// Create a FeedbackDelay with a delay time of 0.2 seconds and feedback of 0.5
const delay = new Tone.FeedbackDelay(0.2, 0.5).toDestination();

// Create a Reverb with a decay time of 2 seconds
const reverb = new Tone.Reverb(2).toDestination();

// Connect the synth to the delay and reverb
// synth.connect(delay);
synth.connect(reverb);

synth.legato = true;

const modelParams = {
    flipHorizontal: false,   // flip e.g for video  
    maxNumBoxes: 1,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
    imageScaleFactor: 0.5
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        if (status) {
            updateNote.innerText = "Instructions: \n #1) Lay your phone on a flat surface in a well lit room. \n #2) Raise your hand over the camera of your phone (1ft-4ft away). \n #3 Try and keep only your hand above your phone's camera. \n #4 To trigger the instument, open your hand wide, this will play the Pocket Theremin Tone. \n #5) To cease playing, close your hand into a tight fist. \n #6) Go forth and shred you sci-fi sounding son of a bitch! "
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = ""
        startVideo();
    } else {
        updateNote.innerText = ""
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = ""
    }
}

function calculateHandSize(handPrediction) {
    const width = handPrediction.bbox[2];
    const height = handPrediction.bbox[3];
    const size = Math.sqrt(width * width + height * height);
    return size;
}

function runDetection() {
    model.detect(video).then(predictions => {
        let handSize = 0;

        // Get handsize
        if(predictions[0]) {
            console.log(predictions[0])
            handSize = calculateHandSize(predictions[0])
        }

        // Trigger synth when the hand is open
        if(predictions[0] && predictions[0].label === "open" && isSynthPlaying !== true) {
            synth.triggerAttack();
            isSynthPlaying = true;
        }

        // Set the frequency of the synth
        if(handSize && predictions[0]) {
            synth.set({ frequency: handSize + 100 });
        }

        if(handSize) {
            document.getElementById("current-frequency").innerHTML = "~ " + (handSize+ 100).toFixed(2) + "hz ~";
            document.getElementById("current-note").innerHTML = "&#9833 " + translateHandDistanceToNoteValue(handSize) + " &#9833 ";
        }

        if(predictions[0] && predictions[0].label === "closed") {
            synth.triggerRelease();
            isSynthPlaying = false;
        }

        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

handTrack.load(modelParams).then(lmodel => {
    model = lmodel
    updateNote.innerText = ""
    trackButton.disabled = false
});

window.addEventListener("load", () => {
    const toggleVideoButton = document.getElementById("trackbutton");
    toggleVideoButton.addEventListener("click", () => {
        toggleVideo()
    })
})

function translateHandDistanceToNoteValue(handDistance) {
    console.log("handdist", handDistance)
    let noteName = "-";
    Object.values(noteFrequencyMapping).forEach(note => {

        if(handDistance >= note.lowThresh && handDistance <= note.highThresh) {
            console.log("in", note)
            noteName = note.noteName;
        }
    })
    return noteName;
}

const noteFrequencyMapping = {
    'C2': { noteName: 'C2', lowThresh: 60.00, highThresh: 64.27 },
    'C#2': { noteName: 'C#2', lowThresh: 64.27, highThresh: 68.38 },
    'D2': { noteName: 'D2', lowThresh: 68.38, highThresh: 72.83 },
    'D#2': { noteName: 'D#2', lowThresh: 72.83, highThresh: 77.55 },
    'E2': { noteName: 'E2', lowThresh: 77.55, highThresh: 82.41 },
    'F2': { noteName: 'F2', lowThresh: 82.41, highThresh: 87.31 },
    'F#2': { noteName: 'F#2', lowThresh: 87.31, highThresh: 92.50 },
    'G2': { noteName: 'G2', lowThresh: 92.50, highThresh: 98.00 },
    'G#2': { noteName: 'G#2', lowThresh: 98.00, highThresh: 103.83 },
    'A2': { noteName: 'A2', lowThresh: 103.83, highThresh: 110.00 },
    'A#2': { noteName: 'A#2', lowThresh: 110.00, highThresh: 116.54 },
    'B2': { noteName: 'B2', lowThresh: 116.54, highThresh: 123.47 },
  
    'C3': { noteName: 'C3', lowThresh: 123.47, highThresh: 130.81 },
    'C#3': { noteName: 'C#3', lowThresh: 130.81, highThresh: 138.59 },
    'D3': { noteName: 'D3', lowThresh: 138.59, highThresh: 146.83 },
    'D#3': { noteName: 'D#3', lowThresh: 146.83, highThresh: 155.56 },
    'E3': { noteName: 'E3', lowThresh: 155.56, highThresh: 164.81 },
    'F3': { noteName: 'F3', lowThresh: 164.81, highThresh: 174.61 },
    'F#3': { noteName: 'F#3', lowThresh: 174.61, highThresh: 185.00 },
    'G3': { noteName: 'G3', lowThresh: 185.00, highThresh: 196.00 },
    'G#3': { noteName: 'G#3', lowThresh: 196.00, highThresh: 207.65 },
    'A3': { noteName: 'A3', lowThresh: 207.65, highThresh: 220.00 },
    'A#3': { noteName: 'A#3', lowThresh: 220.00, highThresh: 233.08 },
    'B3': { noteName: 'B3', lowThresh: 233.08, highThresh: 246.94 },
  
    'C4': { noteName: 'C4', lowThresh: 246.94, highThresh: 261.63 },
    'C#4': { noteName: 'C#4', lowThresh: 261.63, highThresh: 277.18 },
    'D4': { noteName: 'D4', lowThresh: 277.18, highThresh: 293.66 },
    'D#4': { noteName: 'D#4', lowThresh: 293.66, highThresh: 311.13 },
    'E4': { noteName: 'E4', lowThresh: 311.13, highThresh: 329.63 },
    'F4': { noteName: 'F4', lowThresh: 329.63, highThresh: 349.23 },
    'F#4': { noteName: 'F#4', lowThresh: 349.23, highThresh: 369.99 },
    'G4': { noteName: 'G4', lowThresh: 369.99, highThresh: 392.00 },
    'G#4': { noteName: 'G#4', lowThresh: 392.00, highThresh: 415.30 },
    'A4': { noteName: 'A4', lowThresh: 415.30, highThresh: 440.00 },
    'A#4': { noteName: 'A#4', lowThresh: 440.00, highThresh: 466.16 },
    'B4': { noteName: 'B4', lowThresh: 466.16, highThresh: 493.88 },
  
    'C5': { noteName: 'C5', lowThresh: 493.88, highThresh: 523.25 },
    'C#5': { noteName: 'C#5', lowThresh: 523.25, highThresh: 554.37 },
    'D5': { noteName: 'D5', lowThresh: 554.37, highThresh: 587.33 },
    'D#5': { noteName: 'D#5', lowThresh: 587.33, highThresh: 622.25 },
    'E5': { noteName: 'E5', lowThresh: 622.25, highThresh: 659.25 },
    'F5': { noteName: 'F5', lowThresh: 659.25, highThresh: 698.46 },
    'F#5': { noteName: 'F#5', lowThresh: 698.46, highThresh: 739.99 },
    'G5': { noteName: 'G5', lowThresh: 739.99, highThresh: 783.99 },
    'G#5': { noteName: 'G#5', lowThresh: 783.99, highThresh: 830.61 },
    'A5': { noteName: 'A5', lowThresh: 830.61, highThresh: 880.00 },
    'A#5': { noteName: 'A#5', lowThresh: 880.00, highThresh: 932.33 }
}
