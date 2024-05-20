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
        console.log(this.grid);
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

const grid = new Grid([10, 10], 'Hard');