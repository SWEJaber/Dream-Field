import Grid from "./Grid";
import Player from "./Player";

import jQuery from "./jQuery";
import Timer from "./Timer";
window.$ = window.jQuery = jQuery;

let audioElement = $("audio")[0]
audioElement.src = require("../Sound/ROCK_X6_00644.wav")

const audioContext = new AudioContext();

const track = audioContext.createMediaElementSource(audioElement);
track.connect(audioContext.destination)

export const GAMESTATES = {
    TITLE: 0,
    INSTRUCTIONS: 1,
    GAMEPLAY: 2,
    PAUSED: 3,
    RESULTS: 4,
    CREDITS: 5,
};


let instructionsScreenShown = false;
let resultsScreenShown = false;
let creditsScreenShown = false;

let overlay = $("#overlay");
let titleScreen = $("#title")
let instructionsScreen = $("#instructions")
let gameplayScreen = $("#game-play")
let resultScreen = $("#result")
let creditsScreen = $("#credits")


let winnerNumElem = $("#winnerNum")



let startBtnObj = {
    element: $(".startButton"),
    normalSpeed: 1000,
    fastSpeed: 100,
    timer: new Timer(1000),
    pressedStart: false,

    flicker: function(timeDifferential) {

        this.timer.increase(timeDifferential);

        if (this.timer.isDone()) {
            this.element.fadeOut(this.timer.duration / 2).fadeIn(this.timer.duration / 2)
            this.timer.reset()
        }

    },
    toggleFlickerSpeed: function() {
        if (this.timer.duration === this.normalSpeed) {
            this.timer.setDuration(this.fastSpeed)
        } else {
            this.timer.setDuration(this.normalSpeed)
        }
    },

    reset: function(delay) {
        setTimeout(() => {
            this.pressedStart = false;
            this.timer.setDuration(this.normalSpeed);
        }, delay);

    }
}


let delayDurations = {
    // Not used
    preGameDuration: 5000,
    gameOverDuration: 5000,
};

export default class Game {
    constructor(playerInputs) {
        this.state = {
            currentState: GAMESTATES.TITLE,
            previousState: GAMESTATES.TITLE,

            changeState: function(newState) {
                this.previousState = this.currentState;
                this.currentState = newState;
            },
            changeToTitle: function() {
                this.changeState(GAMESTATES.TITLE)

            },

            changeToInstructions: function() {
                this.changeState(GAMESTATES.INSTRUCTIONS);
            },

            changeToGameplay: function() {
                this.changeState(GAMESTATES.GAMEPLAY)


            },

            changeToPaused: function() {
                this.changeState(GAMESTATES.PAUSED)

            },
            changeToResults: function() {
                this.changeState(GAMESTATES.RESULTS)

            },

            changeToCredits: function() {
                this.changeState(GAMESTATES.CREDITS)
            },

            unPause: function() {
                this.changeState(this.previousState)

            },
        };

        this.grid1 = new Grid("1");
        this.grid2 = new Grid("2");
        this.player1 = new Player(1, this.grid1);
        this.player2 = new Player(2, this.grid2);
        this.playerInputs = playerInputs;
    }

    start() {
        titleScreen.show();
        instructionsScreen.hide();
        resultScreen.hide();
        creditsScreen.hide();

        this.player1.start();
        this.player2.start();

        if (length(this.playerInputs) < 2) {
            this.state.changeToPaused();
            overlay.children()[0].innerText = `Please connect two controllers`;
            overlay.show();
        }
    }

    update(timeDifferential) {

        //1: Get the game pads
        if (length(this.playerInputs) < 2) {
            return;
        }

        for (const key in this.playerInputs) {
            if (this.playerInputs.hasOwnProperty(key)) {
                this.playerInputs[key].update(timeDifferential);
            }
        }

        switch (this.state.currentState) {
            case GAMESTATES.TITLE:
                startBtnObj.flicker(timeDifferential)


                if (!startBtnObj.pressedStart && this.shouldToggleStartButton()) {
                    startBtnObj.pressedStart = true;


                    startBtnObj.toggleFlickerSpeed();
                    audioElement.play();

                    this.transitionToInstructionsScreen();
                }
                break;

            case GAMESTATES.INSTRUCTIONS:
                startBtnObj.flicker(timeDifferential)

                if (!startBtnObj.pressedStart && this.shouldToggleStartButton()) {

                    startBtnObj.pressedStart = true;
                    startBtnObj.toggleFlickerSpeed();
                    audioElement.play();
                    this.transitionToGameplayScreen();
                }
                break;

            case GAMESTATES.GAMEPLAY:
                //Check if the game is over
                if (!this.player1.health.isAlive()) {
                    this.endGame(this.player2, this.player1);
                    return;
                } else if (!this.player2.health.isAlive()) {
                    this.endGame(this.player1, this.player2);
                    return;
                }

                overlay.hide();
                //Handle pausing
                if (this.shouldToggleStartButton()) {
                    this.state.changeToPaused();
                }



                //Update players
                this.player1.update(timeDifferential, this.playerInputs[0], this.player2);
                this.player2.update(timeDifferential, this.playerInputs[1], this.player1);
                break;
            case GAMESTATES.PAUSED:
                if (length(this.playerInputs) == 2) {
                    overlay.children()[0].innerText = `Press Start to continue`;

                    overlay.show();

                    if (this.shouldToggleStartButton()) {
                        this.state.unPause();
                        overlay.hide();
                    }
                }
                break;
            case GAMESTATES.RESULTS:
                this.transitionToCreditsScreen();
                break;
            case GAMESTATES.CREDITS:
                if (this.shouldToggleStartButton()) {
                    window.location.reload();
                }
                break;

            default:
                break;
        }


    }

    endGame(winner, loser) {
        winner.frameHandler.changeToWin();
        loser.frameHandler.changeToLose();

        winnerNumElem.text(winner.ID)

        this.transitionToResultScreen();


    }

    shouldToggleStartButton() {
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

    transitionToInstructionsScreen() {

        setTimeout(() => {
            titleScreen.fadeOut(1000);
            startBtnObj.reset(1000);

            setTimeout(() => {

                instructionsScreen.fadeIn(4000);
                this.state.changeToInstructions();

            }, 2000);

        }, 2500);




    }

    transitionToGameplayScreen() {
        if (!instructionsScreenShown) {
            instructionsScreenShown = true;

            setTimeout(() => {
                instructionsScreen.fadeOut(3000);
                startBtnObj.reset(3000);
                setTimeout(() => {

                    gameplayScreen.fadeIn(500);
                    this.state.changeToGameplay()

                }, 5000);

            }, 2000);




        }


    }

    transitionToResultScreen() {
        if (!resultsScreenShown) {
            resultsScreenShown = true;

            setTimeout(() => {
                gameplayScreen.fadeOut(2500);

                setTimeout(() => {


                    resultScreen.fadeIn(500);
                    this.state.changeToResults()

                }, 3500);

            }, 2500);


        }
    }

    transitionToCreditsScreen() {
        if (!creditsScreenShown) {
            creditsScreenShown = true;

            setTimeout(() => {
                resultScreen.fadeOut(500);
                setTimeout(() => {

                    creditsScreen.fadeIn(500);
                    this.state.changeToCredits()

                }, 2000);
            }, 8000);



        }
    }
}