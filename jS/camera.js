
// =====================================
// BEAST MODE - CAMERA MANAGER
// =====================================

let cameraStream = null;

export async function startCamera(videoElement) {
    try {
        if (!navigator.mediaDevices?.getUserMedia) {
            throw new Error("Camera API unavailable. Use HTTPS.");
        }

        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        });

        videoElement.srcObject = cameraStream;
        await videoElement.play();

        return true;

    } catch (error) {
        console.error("Camera error:", error);
        throw error;
    }
}

export function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        cameraStream = null;
    }
}

