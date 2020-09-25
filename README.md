# <img src="https://ga-dash.s3.amazonaws.com/production/assets/logo-9f88ae6c9c3871690e33280fcf557f33.png" height="40"/> <img src="Images\Blob\Blob Icon.png" height="40" style="transform: scaleX(-1);"/> Dream Field
## Introduction
Dream Field is a grid-based two-player competitive game. I developed the game as my first project for the [Software Engineering Immersive course](https://generalassemb.ly/education/software-engineering-immersive-remote), specifically for the Front-End Development unit.

If you have two controllers, You can play Dream Field by clicking <a href="https://jaalsadev.github.io/Dream-Field/" target="_blank">here</a>, if not, click on the GIF below to watch a video.

[![Dream Field Video](/Images/Screenshots/Dream-Field-Gameplay.gif)](https://www.youtube.com/watch?v=cC_-I8DO8Rk "Click here to watch a video!")


## Table of Contents

- [Theme and Game Elements](#Theme-and-Game-Elements)
- [Instructions](#Instructions)
- [Development](#Development)
- [Roadmap](#Roadmap)
- [Bugs and Errors](#Bugs-and-Errors)
- [Team](#Team)

## Theme and Game Elements
Dream Field (as the name suggests) is about dreams. The nature of dreams can vary; they range from ordinary to surreal; they can be exciting, frightening, magical, adventurous, phantasmagoric. They're also a source of infinite inspiration and creativity. 

With Dream Field, I want to deliver an experience that is phantasmagoric, psychedelic, and leans towards surrealism.


### 1. Aesthetics
*Aesthetics* describe the look, sound, and feel of a game.

For the time being, Dream Field contains visuals only, and one sound effect for the start screen.

Dream Field leans towards a cartoonish and simplified art style that gives off a pleasant impression for the players as well as having a high contrast between the saturated hard-edged tiles and the character's soft-edged desaturated color.


### 2. Mechanics
*Mechanics* are the rules of a game. They describe the ways in which a player can reach a goal.

A player can only win the game if they defeat the other player. Players can execute the following actions:
* **Attack**: Players can attack each other using long-range and short-range attacks.
* **Move**: Players can move on the grid horizontally or vertically.




### 3. Technology
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


### 4. Story
None
## Instructions
![Controller Layout](/Images/Screenshots/Controller_Layout.PNG "Controller Layout")
The game requires two gamepads to work. Make sure to press any button If a controller is connected, and the browser hasn't detected it yet.

I had only tested the Gamepad API with an Xbox One controller, and I'm unsure if other controllers will work. If you have a different controller and it doesn't work, let me know.

The game will pause if a controller is disconnected, and an overlay message will appear, providing the appropriate instructions.




## Development
### Inspiration
The idea came to me while I was driving back home from Effat University, where I had finished attending a Software Engineering class. I did not know what kind of game I wanted to develop, especially since I wanted to limit the implementation technology to what I had learned at the time (HTML, CSS, JS) and maybe use the gamepad API. I thought to myself, "What can I do with the grid and flex layouts? They're too basic!". 

The word "grid" kept repeating in my mind, and then suddenly, I remembered a game series that I used to play as a kid; it used grids in the battle section. The game series is Mega Man Battle Network. 
 
 ![Battle Network 6](/Images/Screenshots/Mega-Man-Battle-Network-6.gif)
Developing a game like Battle Network should be fun and enough of a challenge. I can mimic the battle section by creating two different colored panels (Red and Blue), and out of the panels, I can create two colored grids using CSS Grid; after that, I can create the whole battlefield by applying the flexbox layout on the two grids.
### Creating Dreamfield (battlefield) 
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
### Facilitating Player Actions
#### Facilitating Movement
#### Facilitating Attacks
##### Long Range
##### Short Range (Special)
## Roadmap
I'd like to add the following to my game:
* Music and sound effects.
* Environments changing in sync with music (diverse background images and panels).
* Enemy AI.
* More characters.
* Code refactoring.
* Online VS mode.

## Bugs and Errors
* Character image overlaps with other objects in the environment.
* Transition between character frames is delayed sometimes.

## Team
||<img src="https://avatars.githubusercontent.com/JaAlSaDev" height="150" width="150"/>|<img src="https://avatars.githubusercontent.com/Ninja-jumipy2011" height="150" width="150"/>|
| :---: | :---: | :---: |
|**Name** |Jaber Alsalamah|Ashraqat Alsalamah|
|**Role**|Programmer|Artist|
|**GitHub**|<a href="https://github.com/JaAlSaDev">JaAlSaDev</a>|<a href="https://github.com/Ninja-jumipy2011">Ninja-jumipy2011</a>|
|**Links**|<a href="https://twitter.com/JaAlSaDev">Twitter</a>|<a href="https://www.instagram.com/ninja_jumipy2011/">Instagram</a>|



