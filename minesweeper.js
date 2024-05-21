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

    showGrid() {
        //
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
    }

    askGamer(){
        //ask gamer about what difficulty they want to play
        //ask gamer about what grid size they want to play on
        //this.newGame = new Grid(dimensions,difficulty)
    }

    gamerGames(){
        //implement gamer gaming - enter coordinate to select, enter coord to flag etc etc
        //input handling, how to ensure co-ords are correct, how to handle incorrect coords etc etc

    }

    gamerOver(){
        //gamer dead, game over screen
    }

    gamerBigW(){
        //gamer wins tell them they did good woooo
    }

    gamerReplay(){
        //gamer wants more gaming? restart game screen
    }

    gamerQuit(){
        //gamer done with gaming? quit game 
    }


}


class TileRender {
    constructor(Tile){
        this.tile = Tile;
        this.value = '-----\n|   |\n-----';
    }

    clickedValue(){
        if (tile.value){
            this.value = `-----\n| ${this.tile.value} |\n-----`;
        }
        else if (this.tile.type === 'bomb'){
            this.value = `-----\n| 💣 |\n-----`;
        }
        else {
            this.value = `-----\n|   |\n-----`;
        }
    }

    setFlagged(){
        this.value = '-----\n| 🚩 |\n-----';
    }
}

class Renderer {
    constructor(grid){
        this.gridRender = []
        this.makeGrid(grid);
    }

    makeGrid(grid){
        for (let tileRow of grid.grid){
            let newRow = [];
            for (let tile of tileRow){
                let tileRender = new TileRender(tile);
                newRow.push(tileRender);
            }
            this.gridRender.push(newRow);
        }
    }

    showGrid(){
        for (let tileRow of this.gridRender){
            for (let tile of tileRow){
                console.log(tile.value);
            }
        }
    }
}

grid = new Grid([10,10],"Easy");
renderer = new Renderer(grid);
renderer.showGrid();