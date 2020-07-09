import Timer from "./Timer.js";

export default class Player {
    constructor(ID, grid) {
        this.element = $(`#player${ID}`);
        this.ID = ID;
        this.grid = grid;

        this.position = {
            col: 1, //x axis
            row: 1, //y axis
            getPlayerCoordinates: function() {
                return "p(" + this.col + "," + this.row + ")";
            },
            reset: function() {
                this.col = 1;
                this.row = 1;
            },
        };

        this.health = {
            maxHP: 1000,
            HP: this.maxHP,
            UI: $(`#PHUD-${ID} .HealthBar`),

            isAlive: function() {
                return this.HP > 0;
            },

            setup: function() {
                this.HP = this.maxHP;
                this.UI.attr("max", this.maxHP);
            },
        };

        this.smallShotDamage = 1;
        this.chargeShotDamage = 50;

        this.slashShortDamage = 100;
        this.slashLongDamage = 150;
        this.slashWideDamage = 150;

        this.attack = {
            attackLongRanged: function(affectedPlayer, playerARow, damage) {
                //This condition should be changed if more than one players are on the same grid.
                let arePlayersOnTheSameRow = playerARow == affectedPlayer.position.row;

                if (affectedPlayer.health.isAlive() && arePlayersOnTheSameRow) {
                    affectedPlayer.receiveDamage(damage);
                }
            },

            attackShortRange(affectedPlayer, areaRange, damage) {
                if (affectedPlayer.health.isAlive() && areaRange != undefined) {
                    //Within length (col)
                    if (
                        areaRange[0][0] <= affectedPlayer.position.col &&
                        affectedPlayer.position.col <= areaRange[0][1]
                    ) {
                        //Within width (row)
                        if (
                            areaRange[1][0] <= affectedPlayer.position.row &&
                            affectedPlayer.position.row <= areaRange[1][1]
                        ) {
                            affectedPlayer.receiveDamage(damage);
                        }
                    }
                }
            },

            calculateAttackAreaRange(player, colLength, rowLength) {
                //1: Calculate the length of the attack on the 2nd grid
                let columnLimit;
                let columnLimitCondition;

                let ranges = [
                    [], //Column range  (The number of columns that the attack covers)
                    [],
                ]; //Row range   (The number of rows that the attack covers)

                //Handle column range
                if (player.grid.ID == "grid-1") {
                    ranges[0].push(0);
                    columnLimit = player.position.col + colLength;

                    //If you want to generalize this, replace two with column size.
                    columnLimitCondition = columnLimit > 2;

                    //Handle column length
                    if (columnLimitCondition) {
                        ranges[0].push(columnLimit - 3);
                    } else {
                        //Meaning ther other player is not in range of the attack
                        return undefined;
                    }
                } else if (player.grid.ID == "grid-2") {
                    ranges[0].push(2);
                    columnLimit = player.position.col - colLength;
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
                    ranges[1].push(player.position.row);
                    ranges[1].push(player.position.row);
                } else if (rowLength == 2) {
                    ranges[1].push(player.position.row - 1);
                    ranges[1].push(player.position.row + 1);
                } else {
                    return undefined;
                }

                // console.log(ranges);

                return ranges;
            },
        };

        //Special attack
        this.chosenSpecialAttack = 0;

        this.movementTimer = new Timer(131.25);
        this.chargeTimer = new Timer(1000);
        this.specialTimer = new Timer(10000);

        // UI section
        {
            this.specialBar = {
                bar: $(`#PHUD-${ID} .SpecialBar`),

                setup: function(maxValue) {
                    this.bar.attr("max", maxValue);
                    this.bar.attr("value", 0);
                },

                update(currentValue) {
                    this.bar.attr("value", currentValue);
                },
            };

            this.frameHandler = {
                frame: $(`#player${ID} > img`)[0],
                timer: new Timer(650),
                blobImages: {
                    damageImg: require("../Images/blob_damaged.png"),
                    idleImg: require("../Images/blob_idle.png"),
                    longRangeImg: require("../Images/blob_long_range.png"),
                    loseImg: require("../Images/blob_lose.png"),
                    shortRangeImg: require("../Images/blob_short_range.png"),
                    shotImg: require("../Images/blob_shot.png"),
                    wideRangeImg: require("../Images/blob_wide_range.png"),
                    winImg: require("../Images/blob_win.png"),
                },

                isIdle: function() {
                    return (
                        this.frame ==
                        '<img class="pl" src=' + this.blobImages.idleImg + " />"
                    );
                },
                changeFrame: function(newImgSrc) {
                    this.frame.src = newImgSrc;
                    this.timer.reset();
                },
                changeToIdle: function() {
                    this.changeFrame(this.blobImages.idleImg);
                },
                changeToDamaged: function() {
                    this.changeFrame(this.blobImages.damageImg);
                },
                changeToShot: function() {
                    this.changeFrame(this.blobImages.shotImg);
                },
                changeToLongSlash: function() {
                    this.changeFrame(this.blobImages.longRangeImg);
                },
                changeToShortSlash: function() {
                    this.changeFrame(this.blobImages.shortRangeImg);
                },
                changeToWideSlash: function() {
                    this.changeFrame(this.blobImages.wideRangeImg);
                },
                changeToLose: function() {
                    this.changeFrame(this.blobImages.loseImg);
                },
                changeToWin: function() {
                    this.changeFrame(this.blobImages.winImg);
                },
            };

            this.characterIcon = {
                icon: $(`#PHUD-${ID} .CharacterIcon`),

                changeCharacterIconColor: function(color) {
                    this.icon.css("background-color", color);
                },

                showEmptyChargeColor: function() {
                    this.changeCharacterIconColor("gray");
                },
                showChargingColor: function() {
                    this.changeCharacterIconColor("purple");
                },

                showChargedColor: function() {
                    this.changeCharacterIconColor("rgb(204, 0, 204)");
                },
            };

            this.specialIcon = {
                icon: $(`#PHUD-${ID} .SpecialIcon`),
                speciaIcons: {
                    unknownImg: require("../Images/question_mark.png"),
                    shortRangeImg: require("../Images/short_range.png"),
                    wideRangeImg: require("../Images/wide_range.png"),
                    longRangeImg: require("../Images/long_range.png"),
                },
                change: function(newImgSrc) {
                    // this.icon.src = newImgSrc;
                    this.icon.html('<img class="iconImg" src=' + newImgSrc + " />");
                },

                changeToUnknown: function() {
                    this.change(this.speciaIcons.unknownImg);
                },

                changeToShort: function() {
                    this.change(this.speciaIcons.shortRangeImg);
                },
                changeToWide: function() {
                    this.change(this.speciaIcons.wideRangeImg);
                },
                changeToLong: function() {
                    this.change(this.speciaIcons.longRangeImg);
                },
            };
        }
    }

    start() {
        this.health.setup();
        this.specialBar.setup(this.specialTimer.delay);

        this.specialIcon.changeToUnknown();
    }

    update(timeDifferential, inputHandler, playerB) {
        if (!this.health.isAlive()) return;

        this.handleAttack(inputHandler, timeDifferential, playerB);

        this.handleMovement(inputHandler, timeDifferential);

        this.handleAnimation(timeDifferential);
        this.specialBar.update(this.specialTimer.time);
    }

    handleMovement(inputHandler, timeDifferential) {
        if (this.movementTimer.isCharged()) {
            if (inputHandler.isUpPressed()) {
                this.moveUp();
            } else if (inputHandler.isDownPressed()) {
                this.moveDown();
            } else if (inputHandler.isLeftPressed()) {
                this.moveLeft();
            } else if (inputHandler.isRightPressed()) {
                this.moveRight();
            }
        }

        if (inputHandler.anyMovementBtnsPressed()) {
            this.movementTimer.reset();
        } else {
            this.movementTimer.increase(timeDifferential);
        }
    }

    handleAttack(inputHandler, timeDifferential, playerB) {
        let isCharging =
            inputHandler.isXPressed() && this.chargeTimer.isChargingZeroIncluded();

        let shouldReleaseSmallShot = !inputHandler.isXPressed() && this.chargeTimer.isCharging();
        let shouldReleaseChargeShot = !inputHandler.isXPressed() && this.chargeTimer.isCharged();

        let isFullyCharged =
            inputHandler.isXPressed() && this.chargeTimer.isCharged();

        let isSpecialFilling = this.specialTimer.isChargingZeroIncluded();

        let isSpecialFull = this.specialTimer.isCharged();

        //Attacks
        {
            if (isSpecialFilling) {
                this.specialTimer.increase(timeDifferential);
            } else if (isSpecialFull) {
                if (this.chosenSpecialAttack == 0) {
                    this.chosenSpecialAttack = Math.floor(Math.random() * 3 + 1);

                    let specialAttackName = "";

                    switch (this.chosenSpecialAttack) {
                        case 1:
                            specialAttackName = "Short Slash";
                            this.specialIcon.changeToShort();
                            break;

                        case 2:
                            specialAttackName = "Long Slash";
                            this.specialIcon.changeToLong();
                            break;

                        case 3:
                            specialAttackName = "Wide Slash";
                            this.specialIcon.changeToWide();
                            break;
                    }

                    console.log(
                        this.element.attr("id") +
                        " Chosen Special Attack: " +
                        specialAttackName
                    );
                }
            }

            if (inputHandler.isBPressed() && isSpecialFull) {
                // //Choose a random attack here

                switch (this.chosenSpecialAttack) {
                    case 1:
                        this.slashShort(playerB);
                        break;

                    case 2:
                        this.slashLong(playerB);
                        break;

                    case 3:
                        this.slashWide(playerB);
                        break;
                }

                this.specialIcon.changeToUnknown();
                this.chosenSpecialAttack = 0;

                this.specialTimer.reset();
            } else {
                // console.log("Am i going here?");

                if (isCharging) {
                    // console.log("isCharging: " + isCharging);
                    this.chargeTimer.increase(timeDifferential);

                    this.characterIcon.showChargingColor();
                } else if (shouldReleaseSmallShot) {
                    //Release small shot
                    this.shootSmall(playerB);
                    // console.log("small shot released");
                } else if (isFullyCharged) {
                    this.characterIcon.showChargedColor();
                } else if (shouldReleaseChargeShot) {
                    this.shootCharge(playerB);
                }
            }
        }
    }

    handleAnimation(timeDifferential) {
        if (!this.frameHandler.isIdle()) {
            if (this.frameHandler.timer.isChargingZeroIncluded()) {
                this.frameHandler.timer.increase(timeDifferential);
            } else {
                // this.imgTimer.reset();
                this.frameHandler.changeToIdle();
            }
        }
    }

    move() {
        console.log(this.ID + " is moving!");
        this.element
            .detach()
            .appendTo(this.grid.rows[this.position.row][this.position.col]);
    }

    moveHorizontally(numStep) {
        console.log("It works");
        let newCol = this.position.col + numStep;

        if (-1 < newCol && newCol < 3) {
            //1: Change the current position to the new position
            this.position.col = newCol;

            //2: Move player to the destination panel
            this.move();
        } else {
            // console.log("Can't move, already at the egde");
        }
    }

    moveVertically(numStep) {
        console.log("It works");
        let newRow = this.position.row + numStep;

        if (-1 < newRow && newRow < 3) {
            //1: Change the current position to the new position
            this.position.row = newRow;

            //2: Move player to the destination panel
            this.move();
        } else {
            // console.log("Can't move, already at the egde");
        }
    }

    moveUp() {
        this.moveVertically(-1);
    }

    moveDown() {
        this.moveVertically(1);
    }

    moveLeft() {
        this.moveHorizontally(-1);
    }

    moveRight() {
        this.moveHorizontally(1);
    }

    receiveDamage(damage) {
        this.health.HP -= damage;

        if (this.health.HP < 0) {
            this.health.HP = 0;
        }

        //Update health visually
        this.health.UI.attr("value", this.health.HP);

        if (damage > this.smallShotDamage) {
            this.frameHandler.changeToDamaged();
        }
    }

    //Long range

    shootSmall(playerB) {
        this.frameHandler.changeToShot();

        this.characterIcon.showEmptyChargeColor();

        this.attack.attackLongRanged(
            playerB,
            this.position.row,
            this.smallShotDamage
        );

        this.chargeTimer.reset();
    }

    shootCharge(playerB) {
        this.frameHandler.changeToShot();

        this.characterIcon.showEmptyChargeColor();

        this.attack.attackLongRanged(
            playerB,
            this.position.row,
            this.chargeShotDamage
        );

        this.characterIcon.showEmptyChargeColor();
        this.chargeTimer.reset();
    }

    // Short range
    slashShort(playerB) {
        let areaRange = this.attack.calculateAttackAreaRange(this, 1, 1);

        this.frameHandler.changeToShortSlash();
        this.attack.attackShortRange(playerB, areaRange, this.slashShortDamage);
    }

    slashLong(playerB) {
        let areaRange = this.attack.calculateAttackAreaRange(this, 2, 1);

        this.frameHandler.changeToLongSlash();
        this.attack.attackShortRange(playerB, areaRange, this.slashLongDamage);
    }

    slashWide(playerB) {
        let areaRange = this.attack.calculateAttackAreaRange(this, 1, 2);

        this.frameHandler.changeToWideSlash();
        this.attack.attackShortRange(playerB, areaRange, this.slashWideDamage);
    }
}