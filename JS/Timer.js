export default class Timer {
    constructor(delay) {
        this.time = 0;
        this.delay = delay;
    }

    setDelay(delay) {
        this.delay = delay;
    }

    increase(timeDifferential) {
        this.time += timeDifferential;
    }

    isChargingZeroIncluded() {
        return 0 <= this.time && this.time < this.delay;
    }

    isCharging() {
        return 0 < this.time && this.time < this.delay;
    }

    isCharged() {
        return this.time >= this.delay;
    }

    reset() {
        this.time = 0;
    }
}