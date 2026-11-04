

// =====================================
// BEAST MODE - MEDIAPIPE POSE DETECTION
// =====================================

import {
    FilesetResolver,
    PoseLandmarker
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22";

let poseLandmarker = null;

export async function initializePoseDetection() {
    try {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm"
        );

        poseLandmarker = await PoseLandmarker.createFromOptions(
            vision,
            {
                baseOptions: {
                    modelAssetPath:
                        "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numPoses: 1,
                minPoseDetectionConfidence: 0.5,
                minPosePresenceConfidence: 0.5,
                minTrackingConfidence: 0.5
            }
        );

        console.log("MediaPipe initialized successfully");
        return true;

    } catch (error) {
        console.error("MediaPipe initialization failed:", error);
        throw error;
    }
}

export function detectPose(videoElement) {
    if (!poseLandmarker || videoElement.readyState < 2) {
        return null;
    }

    return poseLandmarker.detectForVideo(
        videoElement,
        performance.now()
    );
}

export function closePoseDetection() {
    if (poseLandmarker) {
        poseLandmarker.close();
        poseLandmarker = null;
    }
}
