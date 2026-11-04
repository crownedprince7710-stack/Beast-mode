
// =====================================
// BEAST MODE - WORKOUT HISTORY
// =====================================

import { getWorkouts } from "./storage.js";

export function renderHistory() {
    const container = document.getElementById("historyList");

    if (!container) return;

    const workouts = getWorkouts();

    container.replaceChildren();

    if (workouts.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "No workouts recorded yet.";
        container.appendChild(empty);
        return;
    }

    workouts.forEach(workout => {
        const item = document.createElement("div");
        item.className = "history-item";

        const details = document.createElement("span");
        details.textContent =
            `${workout.exercise || "Workout"} · ${workout.reps || 0} reps`;

        const date = document.createElement("strong");
        date.textContent = new Date(workout.date)
            .toLocaleDateString();

        item.append(details, date);
        container.appendChild(item);
    });
}

