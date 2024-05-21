const prompt = require('prompt-sync')();

class Grid {
    constructor(dimensions, difficulty) {
        this.numTiles = dimensions[0] * dimensions[1];
        this.lenx = dimensions[0];
        this.leny = dimensions[1];
        this.grid = [];
        this.bombs = 0;
        this.setBombs(difficulty);
        this.createGrid(this.addBombs());
    }

    setBombs(difficulty) {
        if (difficulty === 'Hard') {
            this.bombs = Math.floor(this.numTiles / 15);
        } 
        else if (difficulty === 'Medium') {
            this.bombs = Math.floor(this.numTiles / 20);
        } 
        else if (difficulty === 'Easy') {
            this.bombs = Math.floor(this.numTiles / 25);
        }
    }

    addBombs() {
        let bomb_locations = {};
        let bomb = 0;
        while (bomb < this.bombs) {
            let x_cord = Math.floor(Math.random() * this.lenx);
            let y_cord = Math.floor(Math.random() * this.leny);
            if (bomb_locations[x_cord] && bomb_locations[x_cord].includes(y_cord)) {
                continue;
            } 
            else if (bomb_locations[x_cord]) {
                bomb_locations[x_cord].push(y_cord);
                bomb += 1;
            } 
            else {
                bomb_locations[x_cord] = [y_cord];
                bomb += 1;
            }
        }
        return bomb_locations;
    }

    createGrid(bomb_locations) {
        for (let x_cord = 0; x_cord < this.lenx; x_cord++) {
            let this_row = [];
            for (let y_cord = 0; y_cord < this.leny; y_cord++) {
                if (bomb_locations[x_cord] && bomb_locations[x_cord].includes(y_cord)) { 
                    this_row.push(new Tile('bomb'));
                } 
                else {
                    this_row.push(new Tile('placeholder'));
                }
            } 
            this.grid.push(this_row);
        }

        for (let x_cord = 0; x_cord < this.lenx; x_cord++) {
            for (let y_cord = 0; y_cord < this.leny; y_cord++) {
                if (this.grid[x_cord][y_cord].type === 'placeholder') {
                    let value = this.findNumber(x_cord, y_cord);
                    if (value > 0) {
                        this.grid[x_cord][y_cord] = new NumberTile('numberTile', value);
                    } 
                    else {
                        this.grid[x_cord][y_cord] = new Tile('blankTile');
                    }
                }
            }
        }
    }

    findNumber(x, y) {
        let count = 0;
        for (let x1 = Math.max(0, x - 1); x1 <= Math.min(x + 1, this.grid.length - 1); x1++) {
            for (let y1 = Math.max(0, y - 1); y1 <= Math.min(y + 1, this.grid[0].length - 1); y1++) {
                if (this.grid[x1][y1] instanceof Tile && this.grid[x1][y1].type === 'bomb') {
                    count += 1;
                }
            }
        }
        return count;
    }
}

class Tile {
    constructor(type) {
        this.type = type;
    }
}

class NumberTile extends Tile {
    constructor(type, value) {
        super(type);
        this.value = value;
    }
}


class GameSpinnerUpperer {
    constructor() {
        this.askGamer();
        const difficultyMap = {1 : "Easy", 2 : "Medium", 3 : "Hard"}; 
    }

    askGamerDifficulty() {
        console.log("EASY [1] \nMEDIUM [2] \nHARD [3] \n");
        let userDifficulty = prompt("Please select difficulty: (Enter 1, 2, or 3) ");
        return parseInt(userDifficulty, 10);
    }

    askGamerGrid() {
        let userGridX = prompt("Please enter desired x dimension for your grid: ");
        let userGridY = prompt("Please enter desired y dimension for your grid: ");
        return [parseInt(userGridX, 10), parseInt(userGridY, 10)];
    }

    askGamerSelect() {
        let userX = prompt("Please enter desired x coordinate for your selection: ");
        let userY = prompt("Please enter desired y coordinate for your selection: ");
        return [parseInt(userX, 10), parseInt(userY, 10)];
    }

    askGamerFlag() {
        let userFlag = prompt("SELECT COORDINATE [1] \nFLAG COORDINATE [2] \nPlease choose whether you would like to select or flag a coordinate (Enter 1 or 2): ");
        return parseInt(userFlag, 10);
    }

    gamerReplay() {
        let userReplay = prompt("NEW GAME WITH SAME SETTINGS [1] \nNEW GAME WITH NEW SETTINGS [2] \nQUIT GAME [3] \nPlease choose whether you would like to replay or quit (Enter 1, 2, or 3): ");
        return parseInt(userReplay, 10);
    }

    askGamer() {
        let difficulty = this.askGamerDifficulty();
        let gridSizes = this.askGamerGrid();
        const grid = new Grid([gridSizes[0], gridSizes[1]], difficulty);
        const renderer = new Renderer(grid);
        let x = true;
        renderer.showGrid();
        while (x) { // find way of ending game 
            if (this.askGamerFlag() === 1) {  // Ensure that you compare with a number
                const [y, x] = this.askGamerSelect();
                if (x >= 0 && x < grid.lenx && y >= 0 && y < grid.leny) {  // Check bounds
                    renderer.reveal(x, y);
                } else {
                    console.log("Invalid coordinates, please try again.");
                }
                renderer.showGrid();
            }
            else {
                const [y, x] = this.askGamerSelect();
                if (x >= 0 && x < grid.lenx && y >= 0 && y < grid.leny) {  // Check bounds
                    renderer.setFlagged(x, y);
                } else {
                    console.log("Invalid coordinates, please try again.");
                }
                renderer.showGrid();
            }
        }
    }
}

class TileRender {
    constructor(tile){
        this.tile = tile;
        this.value = '   ';  
    }

    clickedValue(){
        if (this.tile.value){
            this.value = ` ${this.tile.value} `;
        }
        else if (this.tile.type === 'bomb'){
            this.value = ' 💣 ';
        }
    }

    setFlagged(){
        if (this.value === '   '){
            this.value = ' 🚩 ';
        }
        else{
            console.log("Can't flag a revealed tile!");
        }
    }

    setEmptyRevealed(){
        if (this.value === '   '){
            this.value = ' 😎 ';
        }
    }

    setNumberRevealed(){
        this.value = ` ${this.tile.value} `;
    }

    setBombRevealed(){
        this.value = ' 💣 ';
        this.gamerOver();
    }

    getTileParts() {
        return {
            top: '-----',
            middle: `|${this.value}|`,
            bottom: '-----'
        };
    }
}

class Renderer {
    constructor(grid){
        this.grid = grid;
        this.gridRender = [];
        this.lenx = grid.lenx;
        this.leny = grid.leny;
        this.makeGrid(grid);
    }

    makeGrid(grid){
        for (let y = 0; y < this.leny; y++){
            let newRow = [];
            for (let x = 0; x < this.lenx; x++){
                let tileRender = new TileRender(grid.grid[x][y]);
                newRow.push(tileRender);
            }
            this.gridRender.push(newRow);
        }
    }

    createXLegend() {
        let legend = "    ";  
        for (let i = 0; i < this.lenx; i++) {
            legend += `  ${i}   `;
        }
        return legend;
    }

    showGrid(){
        const xLegend = this.createXLegend();
        console.log(xLegend);  

        for (let y = 0; y < this.leny; y++) {
            let topRow = `${y} `;   
            let middleRow = "  ";   
            let bottomRow = "  ";   

            for (let tile of this.gridRender[y]){
                const parts = tile.getTileParts();
                topRow += parts.top + " ";
                middleRow += parts.middle + " ";
                bottomRow += parts.bottom + " ";
            }

            console.log(topRow);
            console.log(middleRow);
            console.log(bottomRow);
        }
    }

    reveal(x,y){
        let tileValue = this.grid.grid[x][y].type;   
        if (tileValue === 'bomb'){
            this.revealBomb(x,y);
        }
        if (tileValue === 'blankTile'){
            this.revealEmpty(x,y);
        }
        if (tileValue === 'numberTile'){
            this.revealNumber(x,y);
        }
    }

    revealEmpty(x,y){
        for (let x1 = Math.max(0, x - 1); x1 <= Math.min(x + 1, this.grid.length - 1); x1++) {
            for (let y1 = Math.max(0, y - 1); y1 <= Math.min(y + 1, this.grid[0].length - 1); y1++) {
                if (this.grid[x1][y1] instanceof Tile && this.grid[x1][y1].type === 'blankTile') {
                    this.gridRender[x1][y1].setEmptyRevealed();
                    this.revealEmpty(x1,y1);
                }
                else if (this.grid[x1][y1] instanceof Tile && this.grid[x1][y1].type === 'numberTile') {
                    this.gridRender[x1][y1].setNumberRevealed(); 
                }   
            }
        }
    }

    revealNumber(x,y){
        this.gridRender[x][y].revealNumber();
    }

    revealBomb(x,y){
        this.gridRender[x][y].revealBomb();
        this.gamerOver();
    }

    setFlagged(x,y){
        this.gridRender[x][y].setFlagged();
    }

    revealAll(){
        //code to reveal entire grid
    }

    gamerOver(){
        //gamer dead, game over screen
        console.log('==============================');
        console.log('==============================');
        console.log('==============================');
        console.log(`
        ╔═╗╔═╗╔╦╗╔═╗  ╔═╗╦  ╦╔═╗╦═╗
        ║ ╦╠═╣║║║║╣   ║ ║╚╗╔╝║╣ ╠╦╝
        ╚═╝╩ ╩╩ ╩╚═╝  ╚═╝ ╚╝ ╚═╝╩╚═
        `);
        console.log('==============================');
        console.log('==============================');
        console.log('==============================');
        console.log(` 
        ________  ___       ________      ___    ___      ________  ________  ________  ___  ________   ________      
        |\   __  \|\  \     |\   __  \    |\  \  /  /|    |\   __  \|\   ____\|\   __  \|\  \|\   ___  \|\_____  \     
        \ \  \|\  \ \  \    \ \  \|\  \   \ \  \/  / /    \ \  \|\  \ \  \___|\ \  \|\  \ \  \ \  \\ \  \|____|\  \    
         \ \   ____\ \  \    \ \   __  \   \ \    / /      \ \   __  \ \  \  __\ \   __  \ \  \ \  \\ \  \    \ \__\   
          \ \  \___|\ \  \____\ \  \ \  \   \/  /  /        \ \  \ \  \ \  \|\  \ \  \ \  \ \  \ \  \\ \  \    \|__|   
           \ \__\    \ \_______\ \__\ \__\__/  / /           \ \__\ \__\ \_______\ \__\ \__\ \__\ \__\\ \__\       ___ 
            \|__|     \|_______|\|__|\|__|\___/ /             \|__|\|__|\|_______|\|__|\|__|\|__|\|__| \|__|      |\__\
                                         \|___|/                                                                  \|__|
                                                                                                                       
                                                                                                       `);
        console.log('==============================');
        console.log('==============================');
        console.log('==============================');
    }

    gamerBigW(){
        //gamer wins tell them they did good woooo
    }
}


//grid = new Grid([7,10],'Easy');
//render = new Renderer(grid);
//render.showGrid();


newgame = new GameSpinnerUpperer();