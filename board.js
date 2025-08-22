class Board {
    constructor(ctx) {
        this.ctx = ctx;
        this.grid = this.getEmptyBoard();
    }

    getEmptyBoard() {
        return Array.from(
            { length: ROWS }, () => Array(COLS).fill(0)
        );
    }

    // Draw board state
    draw() {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value) {
                    this.ctx.fillStyle = value; // store color instead of 1
                    this.ctx.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    // Lock the piece into the grid
    freeze(piece) {
        piece.shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if (value) {
                    this.grid[piece.y + dy][piece.x + dx] = piece.color;
                }
            });
        });
    }

    // Check if a move/rotation is valid
    valid(piece) {
        return piece.shape.every((row, dy) => {
            return row.every((value, dx) => {
                if (!value) return true;

                let x = piece.x + dx;
                let y = piece.y + dy;

                return (
                    x >= 0 &&
                    x < COLS &&
                    y < ROWS &&
                    (this.grid[y] && this.grid[y][x] === 0)
                );
            });
        });
    }

    // Clear full rows
    clearLines() {
        let linesCleared = 0;

        this.grid = this.grid.filter(row => {
            if (row.every(value => value !== 0)) {
                linesCleared++;
                return false; // drop this row
            }
            return true;
        });

        // Add empty rows at the top
        while (this.grid.length < ROWS) {
            this.grid.unshift(Array(COLS).fill(0));
        }

        return linesCleared;
    }
}
