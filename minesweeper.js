const prompt = require('prompt-sync')();

class GridRender {
    constructor(dimensions,difficulty){
        this.numTiles = dimensions[0] * dimensions[1];
        this.bombs = 0;
        this.difficulty = difficulty;
        this.dimensions = dimensions;
        this.grid = [];
        this.lenx = dimensions[0];
        this.leny = dimensions[1];
        this.setBombCount(this.difficulty);
        this.createGrid(this.setBombLocations());
        //this.revealAll();
        console.log(`--------------------------\nBe cautious!!!\n-------------------------\nThis grid contains ${this.bombs} bombs!!!!!!!!!!\n---------------------------------\nYou will lose if you reveal any of them!!!!!!!!!!!!!!!!!!!!!!!!!!!\n------------------------------`)
    }

    setBombCount(difficulty) {
        if (difficulty === 'Hard') {
            this.bombs = Math.floor(this.numTiles / 5);
        } 
        else if (difficulty === 'Medium') {
            this.bombs = Math.floor(this.numTiles / 10);
        } 
        else if (difficulty === 'Easy') {
            this.bombs = Math.floor(this.numTiles / 15);
        }
    }

    setBombLocations() {
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
                let tile = new Tile(); 
                if (bomb_locations[x_cord] && bomb_locations[x_cord].includes(y_cord)) { 
                    tile.createTile('bomb')
                    this_row.push(tile);
                } 
                else {
                    this_row.push(tile);
                }
            } 
            this.grid.push(this_row);
        }

        for (let x_cord = 0; x_cord < this.lenx; x_cord++) {
            for (let y_cord = 0; y_cord < this.leny; y_cord++) {
                if (this.grid[x_cord][y_cord].type === 'N/A') {
                    let value = this.findNumber(x_cord, y_cord);
                    if (value > 0) {
                        this.grid[x_cord][y_cord].createNumberTile(value);
                    } 
                    else {
                        this.grid[x_cord][y_cord].createTile('blankTile');
                    }
                }
            }
        }
    }

    findNumber(x, y) {
        let count = 0;
        for (let x1 = Math.max(0, x - 1); x1 <= Math.min(x + 1, this.lenx - 1); x1++) {
            for (let y1 = Math.max(0, y - 1); y1 <= Math.min(y + 1, this.leny - 1); y1++) {
                if (this.grid[x1][y1] instanceof Tile && this.grid[x1][y1].type === 'bomb') {
                    count += 1;
                }
            }
        }
        return count;
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

            for (let tile of this.grid[y]){
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

    reveal(x, y) {
        if (!this.grid[x][y].isRevealed) {
            console.log(`Revealing tile at (${x}, ${y}) with type ${this.grid[x][y].type}`);
            this.grid[x][y].revealValue();
            if (this.grid[x][y].type == 'blankTile'){
                this.revealEmpty(x, y); 
            }
        }
    }

    revealEmpty(x, y) {
        for (let x1 = Math.max(0, x - 1); x1 <= Math.min(x + 1, this.lenx - 1); x1++) {
            for (let y1 = Math.max(0, y - 1); y1 <= Math.min(y + 1, this.leny - 1); y1++) {
                if (!this.grid[x1][y1].isRevealed && this.grid[x1][y1].type != 'bomb') {
                    this.reveal(x1, y1);
                }
            }
        }
    }

    setFlagged(x,y){
        this.grid[x][y].setFlagged();
    }

    revealAll(){
        for (let row of this.grid){
            for (let tile of row){
                tile.revealValue();
            }
        }
        this.showGrid();
    }

    gamerOver(){
        //gamer dead, game over screen
        console.log('=======================================================');
        console.log('=======================================================');
        console.log('=======================================================');
        console.log(`
        ╔═╗╔═╗╔╦╗╔═╗  ╔═╗╦  ╦╔═╗╦═╗
        ║ ╦╠═╣║║║║╣   ║ ║╚╗╔╝║╣ ╠╦╝
        ╚═╝╩ ╩╩ ╩╚═╝  ╚═╝ ╚╝ ╚═╝╩╚═
        `);
        console.log('=======================================================');
        console.log('=======================================================');
        console.log('=======================================================');
        //console.log(` 
        //________  ___       ________      ___    ___      ________  ________  ________  ___  ________   ________      
        //|\   __  \|\  \     |\   __  \    |\  \  /  /|    |\   __  \|\   ____\|\   __  \|\  \|\   ___  \|\_____  \     
        //\ \  \|\  \ \  \    \ \  \|\  \   \ \  \/  / /    \ \  \|\  \ \  \___|\ \  \|\  \ \  \ \  \\ \  \|____|\  \    
        // \ \   ____\ \  \    \ \   __  \   \ \    / /      \ \   __  \ \  \  __\ \   __  \ \  \ \  \\ \  \    \ \__\   
        //  \ \  \___|\ \  \____\ \  \ \  \   \/  /  /        \ \  \ \  \ \  \|\  \ \  \ \  \ \  \ \  \\ \  \    \|__|   
        //   \ \__\    \ \_______\ \__\ \__\__/  / /           \ \__\ \__\ \_______\ \__\ \__\ \__\ \__\\ \__\       ___ 
        //    \|__|     \|_______|\|__|\|__|\___/ /             \|__|\|__|\|_______|\|__|\|__|\|__|\|__| \|__|      |\__\
        //                                 \|___|/                                                                  \|__|
        //                                                                                                               
        //                                                                                               `);
        console.log('==============================');
        console.log('==============================');
        console.log('==============================');
    }

    gamerBigW(){
        for (let x = 0; x < this.lenx; x++) {
            for (let y = 0; y < this.leny; y++) {
                if (this.grid[x][y].type !== 'bomb' && !this.grid[x][y].isRevealed) {
                    return false;
                }
            }
        }
        return true;
    }
}

class Tile {
    constructor(){
        this.type = 'N/A';
        this.value = 0;
        this.isRevealed = false;
        this.displayValue = '   ';
    }

    createTile(type){
        this.type = type
    }

    createNumberTile(value){
        this.type = 'numberTile'
        this.value = value
    }

    revealValue() {
        if (this.type === 'numberTile'){
            this.displayValue = ` ${this.value} `;
        }
        else if (this.type === 'bomb'){
            this.displayValue = ' 💣 ';
        }
        else if (this.type === 'blankTile'){
            this.displayValue = ' 🏆 ';
        }
        this.isRevealed = true;
    }

    setFlagged(){
        if (!this.isRevealed ){
            this.displayValue = ' 🚩 ';
        }
        else{
            console.log("Can't flag a revealed tile!");
        }
    }

    getTileParts() {
        return {
            top: '-----',
            middle: `|${this.displayValue}|`,
            bottom: '-----'
        };
    }

}

class GameSpinnerUpperer {
    constructor() {
        this.difficultyMap = {1 : "Easy", 2 : "Medium", 3 : "Hard"};
        this.askGamer();
    }

    askGamerDifficulty() {
        console.log("EASY [1] \nMEDIUM [2] \nHARD [3] \n");
        let userDifficulty = prompt("Please select difficulty: (Enter 1, 2, or 3) ");
        let answer = parseInt(userDifficulty, 10);
        if (answer === 1 || answer === 2 || answer === 3){
            return answer
        }
        else {
            console.log("Please enter 1, 2 or 3");
            return this.askGamerDifficulty();
        }
    }

    askGamerGrid() {
        let userGridX = prompt("Please enter desired x dimension for your grid: ");
        let userGridY = prompt("Please enter desired y dimension for your grid: "); 
        //let answer = [userGridX,userGridY];
        let answer = [parseInt(userGridX, 10), parseInt(userGridY, 10)];
        if (!isNaN(answer[0]) && !isNaN(answer[1])){
            return answer
        }
        else {
            console.log("Please enter two numbers, one after another");
            this.askGamerGrid();
        }
    }

    askGamerSelect() {
        let userX = prompt("Please enter desired x coordinate for your selection: ");
        let userY = prompt("Please enter desired y coordinate for your selection: ");
        let answer = [parseInt(userX, 10), parseInt(userY, 10)];;
        if (!isNaN(answer[0]) && !isNaN(answer[1])){
            return answer
        }
        else {
            console.log("Please enter two numbers, one after another");
            this.askGamerGrid();
        }
    }

    askGamerFlag() {
        console.log("\nSELECT COORDINATE [1] \nFLAG COORDINATE [2] \n");
        let userFlag = prompt("Please choose whether you would like to select or flag a coordinate (Enter 1 or 2): ");
        let answer = parseInt(userFlag, 10);
        if (answer === 1 || answer === 2){
            return answer
        }
        else {
            console.log("Please enter 1 or 2");
            this.askGamerFlag();
        }
    }

    gamerReplay() {
        console.log("NEW GAME WITH SAME SETTINGS [1] \nNEW GAME WITH NEW SETTINGS [2] \nQUIT GAME [3] \n")
        let userReplay = prompt("Please choose whether you would like to replay or quit (Enter 1, 2, or 3): ");
        let answer = parseInt(userReplay, 10);
        if (answer === 1 || answer === 2 || answer === 3){
            return answer
        }
        else {
            console.log("Please enter 1, 2 or 3");
            this.gamerReplay();
        }
    }

    askGamer() {
        let difficulty = this.difficultyMap[this.askGamerDifficulty()];
        let gridSizes = this.askGamerGrid();
        let gameGrid = new GridRender(gridSizes, difficulty);
        let x = true;
        gameGrid.showGrid();
        //grid.revealAll();
        while (x) { 
            if (this.askGamerFlag() === 1) {  
                let [x, y] = this.askGamerSelect();
                if (x >= 0 && x < gameGrid.lenx && y >= 0 && y < gameGrid.leny) {  // Check bounds
                    gameGrid.reveal(x, y);
                    if (gameGrid.grid[x][y].type === 'bomb'){
                        console.log("Hello bomb found")
                        console.log(gameGrid.grid[x][y].type)
                        gameGrid.gamerOver();
                        break;
                    }
                } else {
                    console.log("Invalid coordinates, please try again.");
                }
                gameGrid.showGrid();
            }
            else {
                let [x, y] = this.askGamerSelect();
                if (x >= 0 && x < gameGrid.lenx && y >= 0 && y < gameGrid.leny) {  // Check bounds
                    gameGrid.setFlagged(x, y);
                } else {
                    console.log("Invalid coordinates, please try again.");
                }
                gameGrid.showGrid();
            }
            if (gameGrid.gamerBigW())
                {
                    console.log("You win!!!");
                    break;
                }
        }
    }
}

newgame = new GameSpinnerUpperer();