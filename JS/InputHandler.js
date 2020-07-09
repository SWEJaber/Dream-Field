export default class InputHandler {
    constructor(gamepad) {
        this.gamepad = gamepad;

        this.pauseBtnTimer = {
            timer: 0,
            delay: 100,

            increase: function(timeDifferential) {
                this.timer += timeDifferential;
            },

            isCharging: function() {
                return 0 <= this.timer && this.timer < this.delay;
            },

            isCharged: function() {
                return this.timer >= this.delay;
            },
            reset: function() {
                this.timer = 0;
            },
        };
    }

    setGamePad(gamepad) {
        this.gamepad = gamepad;
    }

    update(timeDifferential) {
        if (!this.isPausePressed()) {
            this.pauseBtnTimer.increase(timeDifferential);
        }
    }

    isBPressed() {
        return this.gamepad.buttons[1].pressed;
    }

    isXPressed() {
        return this.gamepad.buttons[2].pressed;
    }

    isUpPressed() {
        return this.gamepad.buttons[12].pressed || this.gamepad.axes[1] <= -0.5;
    }

    isDownPressed() {
        return this.gamepad.buttons[13].pressed || this.gamepad.axes[1] >= 0.5;
    }

    isLeftPressed() {
        return this.gamepad.buttons[14].pressed || this.gamepad.axes[0] <= -0.5;
    }

    isRightPressed() {
        return this.gamepad.buttons[15].pressed || this.gamepad.axes[0] >= 0.5;
    }

    anyMovementBtnsPressed() {
        return (
            this.isUpPressed() ||
            this.isDownPressed() ||
            this.isLeftPressed() ||
            this.isRightPressed()
        );
    }

    isPausePressed() {
        return this.gamepad.buttons[9].pressed;
    }
}