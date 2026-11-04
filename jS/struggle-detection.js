
// =====================================
// BEAST MODE - STRUGGLE DETECTION
// =====================================

let repTimes = [];
let lastRepTimestamp = null;
let struggleLevel = "NORMAL";

export function recordRep() {
    const now = Date.now();

    if (lastRepTimestamp !== null) {
        const duration = (now - lastRepTimestamp) / 1000;

        if (duration > 0.5 && duration < 60) {
            repTimes.push(duration);

            if (repTimes.length > 8) {
                repTimes.shift();
            }
        }
    }

    lastRepTimestamp = now;

    return analyzePerformance();
}

export function analyzePerformance() {
    if (repTimes.length < 4) {
        return {
            level: "NORMAL",
            message: "Building your performance baseline"
        };
    }

    const baseline = repTimes.slice(0, 3)
        .reduce((a, b) => a + b, 0) / 3;

    const recent = repTimes.slice(-3)
        .reduce((a, b) => a + b, 0) / 3;

    const slowdown = recent / baseline;

    if (slowdown >= 1.7) {
        struggleLevel = "HIGH";
    } else if (slowdown >= 1.35) {
        struggleLevel = "MODERATE";
    } else {
        struggleLevel = "NORMAL";
    }

    const messages = {
        NORMAL: "Strong pace. Keep going!",
        MODERATE: "Your pace is slowing. Focus!",
        HIGH: "Significant slowdown. Consider resting."
    };

    return {
        level: struggleLevel,
        slowdown: slowdown.toFixed(2),
        message: messages[struggleLevel]
    };
}

export function resetStruggleDetection() {
    repTimes = [];
    lastRepTimestamp = null;
    struggleLevel = "NORMAL";
}

