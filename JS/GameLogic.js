//1: Create players
let player1 = {
    //Player position
    col: 1,      //x axis
    row: 1,      //y axis

    getPlayerCoordinates: function () {
        return "p(" + this.col + "," + this.row + ")";
    },

    element: $('#player1'),
    grid: [],
    gridId: "",

    //Health
    HP: 1000,

    isAlive: function () {
        return this.HP > 0;
    },

    receiveDamage: function (damage) {
        this.HP -= damage;

        if (this.HP < 0) {
            this.HP = 0;
        }

        //Update health visually
        this.element.text(this.HP)
    },

    //Special attack
    chosenSpecialAttack:0,


    //Timers
    //Movement
    movementTimer: 0,
    increaseMovementTimer: function (timeDifferential) {
        this.movementTimer += timeDifferential;
    },

    resetMovementTimer: function () {
        this.movementTimer = 0;
    },

    //Charge
    chargeTimer: 0,
    increaseChargeTimer: function (timeDifferential) {
        this.chargeTimer += timeDifferential;
    },

    resetChargeTimer: function () {
        this.chargeTimer = 0;
    },

    //Special
    specialTimer: 0,
    increaseSpecialTimer: function (timeDifferential) {
        this.specialTimer += timeDifferential;
    },

    resetSpecialTimer: function () {
        this.specialTimer = 0;
    },

}

let player2 = {
    //Player position
    col: 1,      //x axis
    row: 1,      //y axis

    getPlayerCoordinates: function () {
        return "p(" + this.col + "," + this.row + ")";
    },

    element: $('#player2'),
    grid: [],
    gridId: "",

    //Health
    HP: 1000,

    isAlive: function () {
        return this.HP > 0;
    },

    receiveDamage: function (damage) {
        this.HP -= damage;

        if (this.HP < 0) {
            this.HP = 0;
        }

        //Update health visually
        this.element.text(this.HP)
    },

    //Special attack
    chosenSpecialAttack:0,

    //Timers
    //Movement
    movementTimer: 0,
    increaseMovementTimer: function (timeDifferential) {
        this.movementTimer += timeDifferential;
    },

    resetMovementTimer: function () {
        this.movementTimer = 0;
    },

    //Charge
    chargeTimer: 0,
    increaseChargeTimer: function (timeDifferential) {
        this.chargeTimer += timeDifferential;
    },

    resetChargeTimer: function () {
        this.chargeTimer = 0;
    },

    //Special
    specialTimer: 0,
    increaseSpecialTimer: function (timeDifferential) {
        this.specialTimer += timeDifferential;
    },

    resetSpecialTimer: function () {
        this.specialTimer = 0;
    },
}

//2: Create an attack, movement, and delay objects
let movement = {
    move: function (player) {
        let playerElement = player.element;
        playerElement.detach().appendTo(player.grid[player.row][player.col]);
    },

    moveHorizontally: function (player, numStep) {
        let newCol = player.col + numStep;


        if (-1 < newCol && newCol < 3) {

            //1: Change the current position to the new position
            player.col = newCol;

            //2: Move player to the destination panel
            this.move(player);

        } else {
            console.log("Can't move, already at the egde");

        }
    },

    moveVertically: function (player, numStep) {
        let newRow = player.row + numStep;


        if (-1 < newRow && newRow < 3) {
            //1: Change the current position to the new position
            player.row = newRow;

            //2: Move player to the destination panel
            this.move(player);

        } else {
            console.log("Can't move, already at the egde");

        }
    },

    moveUp: function (player) {
        this.moveVertically(player, -1);
    },

    moveDown: function (player) {
        this.moveVertically(player, 1);
    },

    moveLeft: function (player) {
        this.moveHorizontally(player, -1);
    },

    moveRight: function (player) {
        this.moveHorizontally(player, 1);
    },
}

let attack = {
    //Long range
    smallShotDamage: 1,
    chargeShotDamage: 10,

    attackLongRanged: function (affectedPlayer, playerARow, damage) {

        //This condition should be changed if more than one players are on the same grid.
        let arePlayersOnTheSameRow = playerARow == affectedPlayer.row;

        if (affectedPlayer.isAlive() && arePlayersOnTheSameRow) {
            affectedPlayer.receiveDamage(damage);
            affectedPlayer.element.text(affectedPlayer.HP)
        }
    },

    shootSmall: function (playerA, playerB) {
        this.attackLongRanged(playerB, playerA.row, this.smallShotDamage);
    },
    shootCharge: function (playerA, playerB) {
        this.attackLongRanged(playerB, playerA.row, this.chargeShotDamage);
    },


    //Short range
    slashShortDamage: 100,
    slashLongDamage: 150,
    slashWideDamage: 150,

    attackShortRange(affectedPlayer, areaRange, damage) {
        if (affectedPlayer.isAlive() && areaRange != undefined) {
            //Within length (col)
            if (areaRange[0][0] <= affectedPlayer.col && affectedPlayer.col <= areaRange[0][1]) {

                //Within width (row)
                if (areaRange[1][0] <= affectedPlayer.row && affectedPlayer.row <= areaRange[1][1]) {
                    affectedPlayer.receiveDamage(damage);
                    affectedPlayer.element.text(affectedPlayer.HP);
                }
            }


        }
    },

    calculateAttackAreaRange(player, colLength, rowLength) {
        //1: Calculate the length of the attack on the 2nd grid
        let columnLimit;
        let columnLimitCondition;

        let ranges = [[],         //Column range  (The number of columns that the attack covers)
        []];        //Row range   (The number of rows that the attack covers)



        //Handle column range
        if (player.gridId == "grid-1") {
            ranges[0].push(0);
            columnLimit = player.col + colLength;

            //If you want to generalize this, replace two with column size.
            columnLimitCondition = columnLimit > 2;

            //Handle column length
            if (columnLimitCondition) {
                ranges[0].push(columnLimit - 3);
            } else {
                //Meaning ther other player is not in range of the attack
                return undefined;
            }

        } else if (player.gridId == "grid-2") {
            ranges[0].push(2);
            columnLimit = player.col - colLength;
            columnLimitCondition = columnLimit < 0;

            //Handle column length
            if (columnLimitCondition) {
                ranges[0].unshift(columnLimit + 3);
            } else {
                //Meaning ther other player is not in range of the attack
                return undefined;
            }
        } else {
            return undefined;
        }
        //Handle row length 
        if (rowLength == 1) {
            ranges[1].push(player.row);
            ranges[1].push(player.row);

        } else if (rowLength == 2) {
            ranges[1].push(player.row - 1);
            ranges[1].push(player.row + 1);
        } else {
            return undefined;
        }

        console.log(ranges);

        return ranges;
    },

    slashShort: function (playerA, playerB) {
        let areaRange = this.calculateAttackAreaRange(playerA, 1, 1);

        this.attackShortRange(playerB, areaRange, this.slashShortDamage);

    },

    slashLong: function (playerA, playerB) {
        let areaRange = this.calculateAttackAreaRange(playerA, 2, 1);

        this.attackShortRange(playerB, areaRange, this.slashLongDamage);

    },

    slashWide: function (playerA, playerB) {
        let areaRange = this.calculateAttackAreaRange(playerA, 1, 2);

        this.attackShortRange(playerB, areaRange, this.slashWideDamage);

    },


}

let delayDurations = {
    movementDelay: 131.25,
    chargeDelay: 1000,
    specialDelay: 10000,
}

//3: Find the grid panels
let Grid1Panels = $('#grid-1').children();
let Grid2Panels = $('#grid-2').children();

//4: Get gamepads
const gamepads = navigator.getGamepads();

//5: Store valuable information inside the player properties
{
    //Store a reference of each visual panel to its corresponding row and cell
    for (let i = 0; i < 3; i++) {
        let rowG1 = [];
        let rowG2 = [];

        for (let j = 0; j < 3; j++) {
            rowG1.push(Grid1Panels[(3 * i) + j]);
            rowG2.push(Grid2Panels[(3 * i) + j])
        }
        player1.grid.push(rowG1);
        player2.grid.push(rowG2);
    }

    //Store the grid IDs in players
    player1.gridId = "grid-1";
    player2.gridId = "grid-2";

    //5: Show player health in the text content (change this later)
    player1.element.text(player1.HP)
    player2.element.text(player2.HP)
}



// Get the state of all gamepads
window.addEventListener("gamepadconnected", function (e) {
    console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
});

window.addEventListener("gamepaddisconnected", function (e) {
    var gp = navigator.getGamepads()[e.gamepad.index];
    console.log("Gamepad disconnected at index %d: %s. %d buttons, %d axes.",
        gp.index, gp.id,
        gp.buttons.length, gp.axes.length);
});

var oldTimestamp = new Date().getTime();
let currentTime = 0;
let timeDifferential = 0;

function gameLoop() {

    //1: Get the game pads
    const gamepads = navigator.getGamepads();

    //2: Calculate time differential
    currentTime = new Date().getTime();

    timeDifferential = ((currentTime) - oldTimestamp);

    oldTimestamp = currentTime;



    //3: Handle player controls
    {
        if (player1.isAlive() && gamepads[0]) {

            playerControls(gamepads, 0, timeDifferential, player1, player2);

        }

        if (player2.isAlive() && gamepads[1]) {
            playerControls(gamepads, 1, timeDifferential, player2, player1);

        }
    }

    //console.log("Time differential: " + timeDifferential)

    //4: Go to the next animation frame
    window.requestAnimationFrame(gameLoop)
}

playerControls = function (gamepads, gamePadNum, timeDifferential, playerA, playerB) {
    let anyBtnPressed = false;
    let anyMovementBtnsPressed = false;

    let BBtn = gamepads[gamePadNum].buttons[1].pressed;
    let XBtn = gamepads[gamePadNum].buttons[2].pressed;
    let upBtn = gamepads[gamePadNum].buttons[12].pressed;
    let downBtn = gamepads[gamePadNum].buttons[13].pressed;
    let leftBtn = gamepads[gamePadNum].buttons[14].pressed;
    let rightBtn = gamepads[gamePadNum].buttons[15].pressed;

    anyMovementBtnsPressed = upBtn || downBtn || leftBtn || rightBtn;


    let isCharging = XBtn && (0 <= playerA.chargeTimer && playerA.chargeTimer < delayDurations.chargeDelay);

    let shouldReleaseChargeShot = !XBtn && playerA.chargeTimer >= delayDurations.chargeDelay;

    let isFullyCharged = XBtn && (playerA.chargeTimer >= delayDurations.chargeDelay);
    let shouldReleaseSmallShort = !XBtn && (0 < playerA.chargeTimer && playerA.chargeTimer < delayDurations.chargeDelay)

    let isSpecialFilling = 0 <= playerA.specialTimer && playerA.specialTimer < delayDurations.specialDelay;
    let isSpecialFull = playerA.specialTimer >= delayDurations.specialDelay;
    // let shouldExecuteSpecial=BBtn && isSpecialFull;


    //Attacks
    if (isSpecialFilling) {
        playerA.increaseSpecialTimer(timeDifferential);
        playerA.element.css("background-color","#FF7F7F");
        
    } else if (isSpecialFull){
        playerA.element.css("background-color","crimson");

        if (playerA.chosenSpecialAttack==0){

            playerA.chosenSpecialAttack=Math.floor((Math.random() * 3) + 1);

            let specialAttackName="";

            switch (playerA.chosenSpecialAttack) {
                case 1:
                    specialAttackName="Short Slash";
                    break;

                case 2:
                    specialAttackName="Long Slash";
                    break;

                case 3:
                    specialAttackName="Wide Slash";
                    break;
            }
            
            console.log(playerA.element.attr("id")+" Chosen Special Attack: "+specialAttackName);
            
        }
    }

    if (BBtn && isSpecialFull) {
        
            // //Choose a random attack here

            switch (playerA.chosenSpecialAttack) {
                case 1:
                    attack.slashShort(playerA, playerB);
                    break;

                case 2:
                    attack.slashLong(playerA, playerB);
                    break;

                case 3:
                    attack.slashWide(playerA, playerB);
                    break;
            }

            playerA.chosenSpecialAttack=0;


        playerA.resetSpecialTimer();
    } else {
        if (isCharging) {
            playerA.increaseChargeTimer(timeDifferential);

            playerA.element.css("background-color", "cyan");

        } else if (shouldReleaseSmallShort) {
            //Release small shot
            attack.shootSmall(playerA, playerB);

            playerA.element.css("background-color", "white");
            playerA.resetChargeTimer();

        } else if (isFullyCharged) {
            playerA.element.css("background-color", "purple");
        }
        else if (shouldReleaseChargeShot) {
            attack.shootCharge(playerA, playerB);

            playerA.element.css("background-color", "white");
            playerA.resetChargeTimer();
        }
    }



    //Movement
    if (playerA.movementTimer >= delayDurations.movementDelay) {
        if (upBtn) {
            movement.moveUp(playerA);
        } else if (downBtn) {
            movement.moveDown(playerA);
        } else if (leftBtn) {
            movement.moveLeft(playerA);
        } else if (rightBtn) {
            movement.moveRight(playerA);
        }



    }


    if (anyMovementBtnsPressed) {
        playerA.resetMovementTimer();

    } else {
        playerA.increaseMovementTimer(timeDifferential);
    }
}

window.requestAnimationFrame(gameLoop)