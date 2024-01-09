import * as Tone from 'tone'
import * as handTrack from 'handtrackjs';
import "../styles/styles.css";
import "../styles/loadingIcon.css";
const synth = new Tone.Synth({
    oscillator: {
      type: "sawtooth",
    },
  }).toDestination();
const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");
let isVideo = false;
let model = null;
let prevNote = "";

synth.legato = true;

const modelParams = {
    flipHorizontal: true,   // flip e.g for video  
    maxNumBoxes: 20,        // maximum number of boxes to detect
    iouThreshold: 0.5,      // ioU threshold for non-max suppression
    scoreThreshold: 0.6,    // confidence threshold for predictions.
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        if (status) {
            updateNote.innerText = "Instructions: \n #1) Keep your hand open (all fingers out). \n #2) Keep your hand in the video frame. \n #3 Keep your face out of the video fram. \n #4 Use Pocket Therimin in a well lit room."
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
        if(predictions[0]) {
            handSize = calculateHandSize(predictions[0])
        }
        if(handSize && predictions[0].label === "open") {
            document.getElementById("current-note").innerHTML = "&#9833 " + translateHandDistanceToNoteValue(handSize.toFixed(0)) + " &#9833";
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
    if(handDistance >= 140 && handDistance < 170 && prevNote !== "C") {
        prevNote = "C"
        synth.triggerAttackRelease("D4", "4n");
        return "C"
    } 
    else if(handDistance >= 170 && handDistance < 200 && prevNote !== "C") {
        prevNote = "C"
        synth.triggerAttackRelease("Db4", "4n");
        return "C"
    } 
    else if(handDistance >= 200 && handDistance < 230 && prevNote !== "C") {
        prevNote = "C"
        synth.triggerAttackRelease("C4", "4n");
        return "C"
    } 
    else if(handDistance >= 230 && handDistance < 260 && prevNote !== "B") {
        prevNote = "B"
        synth.triggerAttackRelease("B3", "4n");
        return "B"
    } 
    else if(handDistance >= 260 && handDistance < 290 && prevNote !== "Bb") {
        prevNote = "Bb"
        synth.triggerAttackRelease("Bb3", "4n");
        return "Bb"
    } 
    else if(handDistance >= 290 && handDistance < 320 && prevNote !== "A") {
        prevNote = "A"
        synth.triggerAttackRelease("A3", "4n");
        return "A"
    } 
    else if(handDistance >= 320 && handDistance < 350 && prevNote !== "Ab") {
        prevNote = "Ab"
        synth.triggerAttackRelease("Ab3", "4n");
        return "Ab"
    } 
    else if(handDistance >= 350 && handDistance < 380 && prevNote !== "G") {
        prevNote = "G"
        synth.triggerAttackRelease("G3", "4n");
        return "G"
    } 
    else if(handDistance >= 380 && handDistance < 410 && prevNote !== "Gb") {
        prevNote = "Gb"
        synth.triggerAttackRelease("Gb3", "4n");
        return "Gb"
    } 
    else if(handDistance >= 410 && handDistance < 440 && prevNote !== "F") {
        prevNote = "F"
        synth.triggerAttackRelease("F3", "4n");
        return "F"
    } 
    else if(handDistance >= 440 && handDistance < 470 && prevNote !== "E") {
        prevNote = "E"
        synth.triggerAttackRelease("E3", "4n");
        return "E"
    } 
    else if(handDistance >= 470 && handDistance < 500 && prevNote !== "Eb") {
        prevNote = "Eb"
        synth.triggerAttackRelease("Eb3", "4n");
        return "Eb"
    } 
    else if(handDistance >= 500 && handDistance < 530 && prevNote !== "D") {
        prevNote = "D"
        synth.triggerAttackRelease("D3", "4n");
        return "D"
    } 
    else if(handDistance >= 530 && handDistance < 560 && prevNote !== "Db") {
        prevNote = "Db"
        synth.triggerAttackRelease("Db3", "4n");
        return "Db"
    } 
    else if(handDistance >= 560 && handDistance < 590 && prevNote !== "C") {
        prevNote = "C"
        synth.triggerAttackRelease("C3", "4n");
        return "C"
    } 
    else {
        return "-"
    }
}


