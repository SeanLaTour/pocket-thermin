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
    // Get the width and height of the bounding box
    const width = handPrediction.bbox[2];
    const height = handPrediction.bbox[3];

    // Calculate the size (e.g., diagonal length of the bounding box)
    const size = Math.sqrt(width * width + height * height);

    return size;
}

function runDetection() {
    model.detect(video).then(predictions => {
        let handSize = 0;
        if(predictions[0]) {
            handSize = calculateHandSize(predictions[0])
        }
        if(handSize) {
            document.getElementById("current-note").innerHTML = "&#9833 " + translateHandDistanceToNoteValue(handSize.toFixed(2)) + " &#9833";
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
    if(handDistance >= 200 && handDistance < 215) {
        return "C"
    } 
    else if(handDistance >= 215 && handDistance < 230) {
        return "B"
    } 
    else if(handDistance >= 230 && handDistance < 245) {
        return "Bb"
    } 
    else if(handDistance >= 245 && handDistance < 260) {
        return "A"
    } 
    else if(handDistance >= 260 && handDistance < 275) {
        return "Ab"
    } 
    else if(handDistance >= 275 && handDistance < 300) {
        return "G"
    } 
    else if(handDistance >= 300 && handDistance < 315) {
        return "Gb"
    } 
    else if(handDistance >= 315 && handDistance < 330) {
        return "F"
    } 
    else if(handDistance >= 330 && handDistance < 345) {
        return "E"
    } 
    else if(handDistance >= 345 && handDistance < 360) {
        return "Eb"
    } 
    else if(handDistance >= 360 && handDistance < 375) {
        return "D"
    } 
    else if(handDistance >= 375 && handDistance < 400) {
        return "Db"
    } 
    else if(handDistance >= 400 && handDistance < 415) {
        return "C"
    } 
    else {
        return "-"
    }
}


