const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let board;
let piece;
let score = 0;
let lines = 0;
let level = 0;
let dropStart = Date.now();

function play() {
    console.log("Play Button Pressed.");
    board = new Board(ctx);
    piece = new Piece(ctx);

    score = 0;
    lines = 0;
    level = 0;
    updateScore();

    dropStart = Date.now();
    requestAnimationFrame(update);
}

function update() {
    const now = Date.now();
    const delta = now - dropStart;

    // piece falls every 500ms (can scale with level later)
    if (delta > 500) {
        if (!piece.move({x: 0, y: 1}, board)) {
            // lock piece
            board.freeze(piece);

            // check for completed lines
            let cleared = board.clearLines();
            if (cleared > 0) {
                lines += cleared;
                score += getLineClearPoints(cleared, level);
                if (lines >= (level + 1) * 10) {
                    level++;
                }
                updateScore();
            }

            // spawn new piece
            piece = new Piece(ctx);
            if (!board.valid(piece)) {
                alert("Game Over!");
                return; // stop game loop
            }
        }
        dropStart = now;
    }

    // redraw
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.draw();
    piece.draw();

    requestAnimationFrame(update);
}

document.addEventListener("keydown", event => {
    if (!piece) return;

    switch (event.key) {
        case "ArrowLeft":
            piece.move({x: -1, y: 0}, board);
            break;
        case "ArrowRight":
            piece.move({x: 1, y: 0}, board);
            break;
        case "ArrowDown":
            piece.move({x: 0, y: 1}, board);
            break;
        case "ArrowUp":
            piece.rotate(board);
            break;
        case " ":
            while(piece.move({x: 0, y: 1}, board)) {}
            board.freeze(piece);

            let cleared = board.clearLines();
            if(cleared > 0) {
                score += this.getLineScore(cleared);
                lines += cleared;
                updateScore();
            }

            piece = new Piece(ctx);
            break;
    }

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    board.draw();
    piece.draw();
});

function getLineClearPoints(cleared, level) {
    const points = [0, 40, 100, 300, 1200]; // Tetris guideline
    return points[cleared] * (level + 1);
}

function updateScore() {
    document.getElementById("score").innerText = score;
    document.getElementById("lines").innerText = lines;
    document.getElementById("level").innerText = level;
}
