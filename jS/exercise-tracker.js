
// =====================================
// BEAST MODE - EXERCISE TRACKER
// =====================================

let squatCount = 0;
let squatPhase = "standing";
let lastRepTime = 0;

function calculateAngle(a, b, c) {
    const radians =
        Math.atan2(c.y - b.y, c.x - b.x) -
        Math.atan2(a.y - b.y, a.x - b.x);

    let angle = Math.abs(radians * 180 / Math.PI);

    if (angle > 180) {
        angle = 360 - angle;
    }

    return angle;
}

export function trackSquat(landmarks) {
    if (!landmarks || landmarks.length < 33) {
        return null;
    }

    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];

    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];

    if (
        leftHip.visibility < 0.5 ||
        leftKnee.visibility < 0.5 ||
        leftAnkle.visibility < 0.5 ||
        rightHip.visibility < 0.5 ||
        rightKnee.visibility < 0.5 ||
        rightAnkle.visibility < 0.5
    ) {
        return {
            count: squatCount,
            message: "Position your full body in camera"
        };
    }

    const leftAngle = calculateAngle(
        leftHip, leftKnee, leftAnkle
    );

    const rightAngle = calculateAngle(
        rightHip, rightKnee, rightAnkle
    );

    const kneeAngle = (leftAngle + rightAngle) / 2;

    let newRep = false;

    if (kneeAngle < 105 && squatPhase === "standing") {
        squatPhase = "squatting";
    }

    if (kneeAngle > 160 && squatPhase === "squatting") {
        squatPhase = "standing";
        squatCount++;
        lastRepTime = Date.now();
        newRep = true;
    }

    return {
        count: squatCount,
        angle: Math.round(kneeAngle),
        phase: squatPhase,
        newRep,
        message: squatPhase === "squatting"
            ? "Push back up!"
            : "Keep going!"
    };
}

export function resetExercise() {
    squatCount = 0;
    squatPhase = "standing";
    lastRepTime = 0;
}

export function getRepCount() {
    return squatCount;
}

