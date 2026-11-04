
// =====================================
// BEAST MODE - MAIN APPLICATION
// =====================================

import {
    startCamera,
    stopCamera
} from "./camera.js";

import {
    initializePoseDetection,
    detectPose,
    closePoseDetection
} from "./pose-detection.js";

import {
    trackSquat,
    resetExercise
} from "./exercise-tracker.js";

import {
    recordRep,
    resetStruggleDetection
} from "./struggle-detection.js";

import {
    switchToMotivation,
    switchToMusic,
    stopAllAudio
} from "./audio-manager.js";

import {
    saveWorkout
} from "./storage.js";

import {
    renderHistory
} from "./history.js";

// DOM elements

const video = document.getElementById("cameraVideo");
const canvas = document.getElementById("poseCanvas");

const startButton = document.getElementById("startCameraBtn");
const stopButton = document.getElementById("stopCameraBtn");
const workoutButton = document.getElementById("startWorkoutBtn");
const endButton = document.getElementById("stopWorkoutBtn");

const repDisplay = document.getElementById("repCount");
const statusDisplay = document.getElementById("status");
const struggleDisplay = document.getElementById("struggleStatus");

const ctx = canvas?.getContext("2d");

let cameraRunning = false;
let workoutRunning = false;
let animationId = null;
let workoutStartTime = 0;
let currentReps = 0;

function updateStatus(message) {
    if (statusDisplay) {
        statusDisplay.textContent = message;
    }
}

function drawPose(landmarks) {
    if (!ctx || !video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!landmarks) return;

    landmarks.forEach(point => {
        if ((point.visibility ?? 1) < 0.5) return;

        ctx.beginPath();
        ctx.arc(
            point.x * canvas.width,
            point.y * canvas.height,
            5,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "#ff2020";
        ctx.shadowColor = "#ff2020";
        ctx.shadowBlur = 12;
        ctx.fill();
    });

    ctx.shadowBlur = 0;
}

function updateWorkout(result) {
    if (!result) return;

    if (repDisplay) {
        repDisplay.textContent = result.count;
    }

    if (result.newRep) {
        currentReps = result.count;

        const performance = recordRep();

        if (struggleDisplay) {
            struggleDisplay.textContent = performance.message;
        }

        if (performance.level === "HIGH") {
            switchToMotivation();
        } else if (performance.level === "NORMAL") {
            switchToMusic();
        }
    }
}

function detectionLoop() {
    if (!cameraRunning) return;

    try {
        const result = detectPose(video);

        if (result?.landmarks?.length) {
            const landmarks = result.landmarks[0];

            drawPose(landmarks);

            if (workoutRunning) {
                const exerciseResult = trackSquat(landmarks);

                updateWorkout(exerciseResult);
            }
        } else {
            drawPose(null);
        }
    } catch (error) {
        console.error("Detection error:", error);
        updateStatus("Pose detection error");
    }

    animationId = requestAnimationFrame(detectionLoop);
}

async function startWorkout() {
    if (!cameraRunning) {
        updateStatus("Start camera first");
        return;
    }

    workoutRunning = true;
    workoutStartTime = Date.now();
    currentReps = 0;

    resetExercise();
    resetStruggleDetection();

    if (repDisplay) repDisplay.textContent = "0";

    if (struggleDisplay) {
        struggleDisplay.textContent = "Building baseline...";
    }

    updateStatus("WORKOUT ACTIVE");
}

function endWorkout() {
    if (!workoutRunning) return;

    workoutRunning = false;

    const duration = Math.floor(
        (Date.now() - workoutStartTime) / 1000
    );

    saveWorkout({
        exercise: "Squat",
        reps: currentReps,
        durationSeconds: duration
    });

    stopAllAudio();
    renderHistory();

    updateStatus("Workout completed");
}

async function enableCamera() {
    try {
        if (!video) {
            throw new Error("Camera video element missing");
        }

        updateStatus("Loading AI model...");

        await initializePoseDetection();

        await startCamera(video);

        cameraRunning = true;

        updateStatus("AI CAMERA ACTIVE");

        detectionLoop();

    } catch (error) {
        console.error(error);
        updateStatus("Camera / AI unavailable: " + error.message);

        stopCamera();
        closePoseDetection();
    }
}

function disableCamera() {
    cameraRunning = false;
    workoutRunning = false;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    stopCamera();
    closePoseDetection();
    stopAllAudio();

    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    updateStatus("Camera stopped");
}

// Event listeners

startButton?.addEventListener("click", enableCamera);
stopButton?.addEventListener("click", disableCamera);

workoutButton?.addEventListener("click", startWorkout);
endButton?.addEventListener("click", endWorkout);

// Initial application setup

renderHistory();
updateStatus("BEAST MODE READY");

console.log("BEAST MODE application loaded");

