import jQuery from "./JS/jQuery.js";
window.$ = window.jQuery = jQuery;
import Game from "./JS/Game.js";
import InputHandler from "./JS/InputHandler.js";

let playerInputs = {};
let overlay = $("#overlay");
length = (obj) => {
    return Object.keys(obj).length;
};
//Detect gamepad events (connect, disconnect)
window.addEventListener("gamepadconnected", function(e) {
    var gamepad = e.gamepad;
    console.log(
        "Gamepad connected at index %d: %s. %d buttons, %d axes.",
        gamepad.index,
        gamepad.id,
        gamepad.buttons.length,
        gamepad.axes.length
    );

    playerInputs[gamepad.index] = new InputHandler(gamepad);

    if (length(playerInputs) == 1) {
        overlay.children()[0].innerText = `Please connect another controller`;

        overlay.show();
    }
});

window.addEventListener("gamepaddisconnected", function(e) {
    var gp = navigator.getGamepads()[e.gamepad.index];
    var gamepad = e.gamepad;
    console.log(
        "Gamepad disconnected at index %d: %s. %d buttons, %d axes.",
        gamepad.index,
        gamepad.id,
        gamepad.buttons.length,
        gamepad.axes.length
    );

    delete playerInputs[gamepad.index];
    if (length(playerInputs) == 1) {
        overlay.children()[0].innerText = `Gamepad ${gp.index} disconnected`;

        overlay.show();
    } else if (length(playerInputs) == 0) {
        overlay.children()[0].innerText = `Please connect two controllers`;

        overlay.show();
    }
});

let game = new Game(playerInputs);
game.start();

let previousTimestamp = 0;

function gameLoop(timestamp) {
    //1: Calculate time differential
    let timeDifferential = timestamp - previousTimestamp;
    previousTimestamp = timestamp;

    //2: Update game
    game.update(timeDifferential);

    //3: Go to the next animation frame
    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);