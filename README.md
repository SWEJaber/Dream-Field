# Dream Field
# 1. Introduction
Dream Field is grid-based two player game, where the goal is to defeat the other player through battle.

[![Dream Field Video](/Images/Screenshots/Dream-Field-Gameplay.gif)](https://www.youtube.com/watch?v=cC_-I8DO8Rk "Click here to watch a video!")



# 2. Game Elements
## 1. Aesthetics
*Aesthetics* describe the look, sound, and feel of a game.

For the time being, Dream Field contains visuals only, and one sound effect for the start screen.

## 2. Mechanics
*Mechanics* are the rules of a game. They describe the ways in which a player can reach a goal.

A player can only win the game if they defeat the other player. Players can execute the following actions:
* **Attack**: Players can attack each other using long-range and short-range attacks.
* **Move**: Players can move on the grid horizontally or vertically.




## 3. Technology
*Technology* refers to the medium that the rest of the game elements take place in.
1. **Design**: 
 * **Pen and Paper**: Prototyping screens, game mechanics, and artwork.
 * [**Figma**](): Prototyping screens.
 * [**Krita**](https://krita.org/en/): Artwork.
 * [**draw.io**](https://drawio-app.com/): UML diagrams.
 
2. **Implementation**:
 * **Javascript**: Game mechanics, controls, [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API "Gamepad API").
 * [**jQuery**](https://jquery.com/ "**jQuery**"): Screen transitions, character frame transitions.
 * [**Parcel**](https://parceljs.org/): Web application bundler.
 * **CSS**: Styling.
 * **HTML**: Website structure.


## 4. Story
None
# 3. Instructions
The game requires two gamepads to work.

![Controller Layout](/Images/Screenshots/Controller_Layout.PNG "Controller Layout")


# 4. Development (Screenshots)
## 4.1. How it Came to Be
The idea came to me while I was driving back home from Effat University, where I had finished attending a Software Engineering class. I did not know what kind of game I wanted to develop, especially since I wanted to limit the implementation technology to what I had learned at the time (HTML, CSS, JS) and maybe use the gamepad API. I thought to myself, "What can I do with the grid and flex layouts? They're too basic!". 

The word "grid" kept repeating in my mind, and then suddenly, I remembered a game series that I used to play as a kid; it used grids in the battle section. The game series is Mega Man Battle Network. 
 
 ![Battle Network 6](/Images/Screenshots/Mega-Man-Battle-Network-6.gif)
Developing a game like Battle Network should be fun and enough of a challenge. I can mimic the battle section by creating two different colored panels (Red and Blue), and out of the panels, I can create two colored grids using CSS Grid; after that, I can create the whole battlefield by applying the flexbox layout on the two grids.
## 4.2 Creating Dreamfield (battlefield) 
Dreamfield is a battlefield that consists of two distinctly colored grids. Each grid consists of nine panels organized in a 3x3 fashion. A panel is a platform on which, at most, one object (such as a character) can stand on.
![Dream Field Wireframe](/Images/Screenshots/Wireframes/Dream-Field-Wireframe.png)

I created Dreamfield by using a div with the class "Dreamfield"
```HTML 
<div class="Dreamfield"></div>
```
The Dreamfield div has two divs with the class "grid" nested in it, grid-1 and grid-2.
```HTML 
<div class="grid" id="grid-1"></div>
<div class="grid" id="grid-2"></div>
```

Each grid div has nine divs with the class "panel". The panel divs' ids are numbered from 1 to 9.

```HTML 
<div class="panel" id="1"></div>
<div class="panel" id="2"></div>
                .
                .
                .
<div class="panel" id="9"></div>
```

Of course, without any styling, Dreamfield will look like a long column of panels. I added a rule for the Dreamfield div to place the grid divs on a row and place them at the center of the screen, and then I added a rule for both grids to place the panels in a 3x3 grid layout.

```CSS
.Dreamfield {
    display: flex;
    justify-content: center;
}

.grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
}
```

To utilize Dreamfield for gameplay purposes, I created a Grid class that stores a reference to all the panels of a grid in a 2D array. The Grid class requires an ID to fetch and store the panels of a specific grid.

```JavaScript
export default class Grid {
    constructor(ID) {
        this.ID = `grid-${ID}`;
        this.rows = [];
        let panels = $(`#grid-${ID}`).children();

        //Store a reference of each visual panel to its corresponding row and column
        for (let i = 0; i < 3; i++) {
            let row = [];

            for (let j = 0; j < 3; j++) {
                row.push(panels[3 * i + j]);
            }
            this.rows.push(row);
        }
    }
}
```
## 4.3. Facilitating Player Actions
### 4.3.1. Facilitating Movement
### 4.3.2. Facilitating Attacks
#### Long Range
#### Short Range (Special)
## Design
### Character Artwork
### UML Diagrams
#### Use Cases
#### Domain Model
### Screens
![Paper wireframe](/Images/Screenshots/Wireframes/Gameplay%20Wireframe.jpg)

![Figma wireframe](/Images/Screenshots/Wireframes/Fleshed%20out%20wireframe.PNG)

# 5. Future Work
I'd like to add the following to my game:
* Music and sound effects.
* Environments changing in sync with music (diverse background images and panels).
* Enemy AI.
* More characters.
* Code refactoring.
* Online VS mode.

# 6. Bugs and Errors
* Character image overlaps with other objects in the environment.
* Transition between character frames is delayed sometimes.

# 7. Development Team
* Jaber Alsalamah - Programmer
* Ashraqat Alsalamah - Artist (![Instagram page](https://www.instagram.com/ninja_jumipy2011/))
