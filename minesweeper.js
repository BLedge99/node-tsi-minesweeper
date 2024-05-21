class Grid {
    constructor(dimensions, difficulty) {
        this.numTiles = dimensions[0] * dimensions[1];
        this.lenx = dimensions[0];
        this.leny = dimensions[1];
        this.grid = [];
        this.bombs = 0;
        this.setBombs(difficulty);
        this.createGrid(this.addBombs());
        this.showGrid();
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
    constructor(){
        this.askGamer()
        this.newGame = 0
        const readline = require('node:readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });    
    }

    promptUser(question) {
        return new Promise((resolve) => {
            rl.question(question, (answer) => {
            resolve(answer);
            });
        });
    }    

    async askGamerDifficulty(){
        console.log("EASY [1] \n MEDIUM [2] \n HARD [3] \n");
        userDifficulty = await promptUser("Please select difficulty: (1,2,3) ");
        //input handling
        return userDifficulty
    }

    async askGamerGrid(){
        userGrid = await promptUser("Please enter desired grid dimensions ie 4, 5");
        //input handling
        return userGrid
    }

    async askGamerSelect(){
        userSelect = await promptUser("Please enter desired co-ordinate");
        //input handling
        return userSelect
    }

    async askGamerFlag(){
        userFlag = await promptUser("SELECT COORDINATE [1] \n FLAG COORDINATE [2] \n Please choose wheter you would like to select or flag a coordinate (1,2): ");
        //input handling
        return userFlag
    }

    async gamerReplay(){
        userReplay = await promptUser("NEW GAME WITH SAME SETTINGS [1] \n NEW GAME WITH NEW SETTINGS [2] \n QUIT GAME [3] \n Please choose wheter you would like to replay or quit (1,2,3): ");
        //input handling
        return userReplay
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

    revealEmpty(x,y){
        for (let x1 = Math.max(0, x - 1); x1 <= Math.min(x + 1, this.grid.length - 1); x1++) {
            for (let y1 = Math.max(0, y - 1); y1 <= Math.min(y + 1, this.grid[0].length - 1); y1++) {
                if (this.grid[x1][y1] instanceof Tile && this.grid[x1][y1].type === 'blankTile') {
                    this.grid[x1][y1].setEmptyRevealed();
                    this.revealEmpty(x1,y1);
                }
            }
        }
    }

    revealNumber(x,y){
        this.grid[x][y].revealNumber();
    }

    revealBomb(x,y){
        this.grid[x][y].revealBomb();
        this.gamerOver();
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



const grid = new Grid([12, 9], "Easy");
const renderer = new Renderer(grid);
renderer.showGrid();
