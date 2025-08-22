const SHAPES = {
    I: [
        [1, 1, 1, 1]
    ],
    O: [
        [1, 1],
        [1, 1]
    ],
    T: [
        [1, 1, 1],
        [0, 1, 0]
    ],
    L: [
        [1, 0, 0],
        [1, 1, 1]
    ],
    J: [
        [0, 0, 1],
        [1, 1, 1]
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0]
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1]
    ]
};

class Piece {
    constructor(ctx) {
        this.ctx = ctx;
        this.shape = randomShape(); // Testing with T piece
        this.color = this.randomColor();
        this.x = 3;
        this.y = 0;
    }

    randomColor(){
        const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'cyan', 'orange'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.shape.forEach((row, dy) => {
            row.forEach((value, dx) => {
                if(value) {
                    this.ctx.fillRect(this.x + dx, this.y + dy, 1, 1);
                }
            });
        });
    }

    move(p, board) {
        this.x += p.x;
        this.y += p.y;

        if(!board.valid(this)){
            this.x -= p.x;
            this.y -= p.y;
            return false;
        }
        return true;
    }

    rotate(board) {
        const PREVSHAPE = this.shape;

        // Transpose + reverse rows (matrix rotation)
        this.shape = this.shape[0].map((_, i) => 
            this.shape.map(row => row[i]).reverse()
        );

        if(!board.valid(this)){
            this.shape = PREVSHAPE;
        }
    }
}

function randomShape() {
    const KEYS = Object.keys(SHAPES);
    const RANDKEY = KEYS[Math.floor(Math.random() * KEYS.length)];
    return SHAPES[RANDKEY];
}