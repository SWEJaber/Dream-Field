export default class Timer {
    constructor(duration) {
        this.timePassed = 0;
        this.duration = duration;
    }

    setDuration(duration) {
        this.duration = duration;
    }

    increase(timeDifferential) {
        this.timePassed += timeDifferential;
    }

    isInProgressZeroIncluded() {
        return 0 <= this.timePassed && this.timePassed < this.duration;
    }

    isInProgress() {
        return 0 < this.timePassed && this.timePassed < this.duration;
    }

    isDone() {
        return this.timePassed >= this.duration;
    }

    reset() {
        this.timePassed = 0;
    }
}