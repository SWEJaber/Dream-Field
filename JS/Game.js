import Grid from "./Grid.js";
import Player from "./Player.js";

import jQuery from "./jQuery.js";
window.$ = window.jQuery = jQuery;

export const GAMESTATES = {
    PREGAME: 0,
    ONGOING: 1,
    PAUSED: 2,
    GAMEOVER: 3,
};

let gameOverScreenShown = false;
let overlay = $("#overlay");

let delayDurations = {
    // Not used
    preGameDuration: 5000,
    gameOverDuration: 5000,
};

export default class Game {
    constructor(playerInputs) {
        this.state = {
            currentState: GAMESTATES.PAUSED,

            changeToOnGoing: function() {
                this.currentState = GAMESTATES.ONGOING;
            },

            changeToPaused: function() {
                this.currentState = GAMESTATES.PAUSED;
            },

            changeToGameOver: function() {
                this.currentState = GAMESTATES.GAMEOVER;
            },

            isOngoing: function() {
                return this.currentState === GAMESTATES.ONGOING;
            },

            isPaused: function() {
                return this.currentState === GAMESTATES.PAUSED;
            },

            isGameOver: function() {
                return this.currentState === GAMESTATES.GAMEOVER;
            },
        };

        this.grid1 = new Grid("1");
        this.grid2 = new Grid("2");
        this.player1 = new Player(1, this.grid1);
        this.player2 = new Player(2, this.grid2);
        this.playerInputs = playerInputs;
    }

    start() {
        this.player1.start();
        this.player2.start();

        if (length(this.playerInputs) < 2) {
            overlay.show();
        }
    }

    update(timeDifferential) {
        //1: Get the game pads
        if (length(this.playerInputs) < 2) {
            this.state.changeToPaused();
            // overlay.show();
            return;
        }

        for (const key in this.playerInputs) {
            if (this.playerInputs.hasOwnProperty(key)) {
                this.playerInputs[key].update(timeDifferential);
            }
        }

        if (this.state.isOngoing()) {
            overlay.hide();
            //Handle pausing
            if (this.togglePause()) {
                this.state.changeToPaused();
            }

            //Check if the game is over
            if (!this.player1.health.isAlive()) {
                this.endGame(this.player2, this.player1);
            } else if (!this.player2.health.isAlive()) {
                this.endGame(this.player1, this.player2);
            }

            //Update players
            this.player1.update(timeDifferential, this.playerInputs[0], this.player2);
            this.player2.update(timeDifferential, this.playerInputs[1], this.player1);
        } else if (this.state.isPaused()) {
            // gamepads != undefined &&
            if (length(this.playerInputs) == 2) {
                overlay.children()[0].innerText = `Press Start to continue`;

                overlay.show();

                if (this.togglePause()) {
                    this.state.changeToOnGoing();
                }
            } else {
                // console.log("Gamepads are disconnected!");
            }
        } else if (this.state.isGameOver()) {
            //Change to another screen here
            if (!gameOverScreenShown) {
                setTimeout(() => {
                    overlay.children()[0].innerText = `Press start to replay!`;
                    console.log("Hello!");

                    overlay.show();
                    gameOverScreenShown = true;
                }, 5000);
            } else {
                if (this.togglePause()) {
                    window.location.reload();
                }
            }
        }
    }

    endGame(winner, loser) {
        winner.frameHandler.changeToWin();
        loser.frameHandler.changeToLose();
        this.state.changeToGameOver();
        overlay.children()[0].innerText = `Game Over! Player ${winner.ID} wins!`;

        overlay.show();
    }

    togglePause() {
        let result = false;

        for (const key in this.playerInputs) {
            if (this.playerInputs.hasOwnProperty(key)) {
                const playerInput = this.playerInputs[key];

                if (playerInput.isPausePressed()) {
                    if (playerInput.pauseBtnTimer.isCharged()) {
                        result = true;
                        playerInput.pauseBtnTimer.reset();
                    }
                }
            }
        }

        return result;
    }
}