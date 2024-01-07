import Tone from 'tone';
import * as handTrack from 'handtrackjs';
// const synth = new Tone.Synth().toDestination();

const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let isVideo = false;
let model = null;

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Video started. Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}

function calculateHandSize(handPrediction) {
    // Get the width and height of the bounding box
    const width = handPrediction.bbox[2];
    const height = handPrediction.bbox[3];

    // Calculate the size (e.g., diagonal length of the bounding box)
    const size = Math.sqrt(width * width + height * height);

    return size;
}

function runDetection() {
    model.detect(video).then(predictions => {
        console.log("Predictions: ", predictions);
        console.log("params", model.getModelParameters())
        let handSize = 0;
        if(predictions[0]) {
            handSize = calculateHandSize(predictions[0])
        }
        if(handSize) {
            document.getElementById("current-note").innerHTML = "Current Hand Distance: " + handSize.toFixed(2);

        }
        model.renderPredictions(predictions, canvas, context, video);
        if (isVideo) {
            requestAnimationFrame(runDetection);
        }
    });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    trackButton.disabled = false
});

window.addEventListener("load", () => {
    console.log("load")
    const toggleVideoButton = document.getElementById("trackbutton");
    console.log("btn", toggleVideoButton)

    toggleVideoButton.addEventListener("click", () => {
        toggleVideo()
    })
})
