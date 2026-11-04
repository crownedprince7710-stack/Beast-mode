
// =====================================
// BEAST MODE - LOCAL STORAGE
// =====================================

const STORAGE_KEY = "beastModeWorkouts";

export function saveWorkout(workout) {
    const history = getWorkouts();

    history.unshift({
        id: Date.now(),
        date: new Date().toISOString(),
        ...workout
    });

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(history)
    );

    return history;
}

export function getWorkouts() {
    try {
        return JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );
    } catch (error) {
        console.error("Could not read workout history:", error);
        return [];
    }
}

export function clearWorkouts() {
    localStorage.removeItem(STORAGE_KEY);
}

