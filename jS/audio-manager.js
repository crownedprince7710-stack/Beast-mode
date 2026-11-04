
// =====================================
// BEAST MODE - AUDIO MANAGER
// =====================================

let currentMode = "MUSIC";

export async function switchToMotivation() {
    const music = document.getElementById("musicAudio");
    const motivation = document.getElementById("motivationAudio");

    if (!music || !motivation) return;

    if (currentMode === "MOTIVATION") return;

    currentMode = "MOTIVATION";

    music.pause();
    motivation.currentTime = 0;

    try {
        await motivation.play();
    } catch (error) {
        console.warn("Motivation audio needs user interaction:", error);
    }
}

export async function switchToMusic() {
    const music = document.getElementById("musicAudio");
    const motivation = document.getElementById("motivationAudio");

    if (!music || !motivation) return;

    if (currentMode === "MUSIC") return;

    currentMode = "MUSIC";

    motivation.pause();

    try {
        await music.play();
    } catch (error) {
        console.warn("Music playback needs user interaction:", error);
    }
}

export function stopAllAudio() {
    const music = document.getElementById("musicAudio");
    const motivation = document.getElementById("motivationAudio");

    [music, motivation].forEach(audio => {
        if (audio) audio.pause();
    });

    currentMode = "MUSIC";
}

export function getAudioMode() {
    return currentMode;
}

