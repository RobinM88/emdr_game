export class Stats {
    constructor() {
        this.perfectJumps = 0;
        this.totalJumps = 0;
        this.longestStreak = 0;
        this.currentStreak = 0;
        this.sessionStartTime = null;
        this.sessionDuration = 0;
        this.lastScoreUpdate = 0;
    }

    reset() {
        this.perfectJumps = 0;
        this.totalJumps = 0;
        this.longestStreak = 0;
        this.currentStreak = 0;
        this.sessionStartTime = Date.now();
        this.sessionDuration = 0;
        this.lastScoreUpdate = 0;
    }

    updateSessionTime(currentTime) {
        if (this.sessionStartTime) {
            this.sessionDuration = Math.floor((currentTime - this.sessionStartTime) / 1000);
        }
    }

    recordJump(isPerfect) {
        this.totalJumps++;
        if (isPerfect) {
            this.perfectJumps++;
            this.currentStreak++;
            if (this.currentStreak > this.longestStreak) {
                this.longestStreak = this.currentStreak;
            }
        } else {
            this.currentStreak = 0;
        }
    }

    getSuccessRate() {
        return this.totalJumps > 0
            ? Math.round((this.perfectJumps / this.totalJumps) * 100)
            : 0;
    }

    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    display() {
        const statsContainer = document.getElementById('statsContainer');
        if (!statsContainer) return;

        statsContainer.innerHTML = `
            <h2>Session Statistics</h2>
            <p>Duration: ${this.formatDuration(this.sessionDuration)}</p>
            <p>Perfect Jumps: ${this.perfectJumps}</p>
            <p>Total Jumps: ${this.totalJumps}</p>
            <p>Longest Streak: ${this.longestStreak}</p>
            <p>Success Rate: ${this.getSuccessRate()}%</p>
        `;
        statsContainer.style.display = 'block';
    }
} 