let blockSize = 25;
let total_row = 17;
let total_col = 17;
let board;
let context;

let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

let speedX = 0;
let speedY = 0;

let snakeBody = [];
let foodX;
let foodY;
let gameOver = false;
let walls = [];
let score = 0; // Initialize score

function generateWalls() {
    let wallCount = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < wallCount; i++) {
        let x = Math.floor(Math.random() * total_col) * blockSize;
        let y = Math.floor(Math.random() * total_row) * blockSize;
        walls.push([x, y]);
    }
}
generateWalls();

let snakeHeadImage = new Image();
snakeHeadImage.src = "snakeHead.png";

let foodImage = new Image();
foodImage.src = "jerry.png";

document.addEventListener("DOMContentLoaded", function () {
    board = document.getElementById("board");
    board.height = total_row * blockSize;
    board.width = total_col * blockSize;
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", changeDirection);
    setInterval(update, 1500 / 10);
});

function update() {
    if (gameOver) return;

    context.fillStyle = "gray";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "brown";
    walls.forEach(wall => {
        context.fillRect(wall[0], wall[1], blockSize, blockSize);
    });

    context.drawImage(foodImage, foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        score += 2; // Increase score by 2
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    snakeX += speedX * blockSize;
    snakeY += speedY * blockSize;

    context.drawImage(snakeHeadImage, snakeX, snakeY, blockSize, blockSize);
    drawSnakeEyes(snakeX, snakeY, speedX, speedY);

    snakeBody.forEach(segment => {
        context.fillStyle = "white";
        context.beginPath();
        context.arc(segment[0] + blockSize / 2, segment[1] + blockSize / 2, blockSize / 2, 0, Math.PI * 2);
        context.fill();
    });

    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, 20); // Display score

    if (snakeX < 0 || snakeX >= total_col * blockSize || snakeY < 0 || snakeY >= total_row * blockSize) {
        gameOver = true;
        alert("BETTER LUCK NEXT TIME: " + score);
    }

    snakeBody.forEach(segment => {
        if (snakeX === segment[0] && snakeY === segment[1]) {
            gameOver = true;
            alert("BETTER LUCK NEXT TIME: " + score);
        }
    });

    walls.forEach(wall => {
        if (snakeX === wall[0] && snakeY === wall[1]) {
            gameOver = true;
            alert("BETTER LUCK NEXT TIME: " + score);
        }
    });
}

function drawSnakeEyes(snakeX, snakeY, speedX, speedY) {
    let eyeSize = blockSize / 6;
    let eyeOffset = blockSize / 4;
    let eye1X, eye1Y, eye2X, eye2Y;

    if (speedX === 1) {
        eye1X = snakeX + blockSize - eyeOffset;
        eye2X = snakeX + blockSize - eyeOffset;
        eye1Y = snakeY + eyeOffset;
        eye2Y = snakeY + blockSize - eyeOffset;
    } else if (speedX === -1) {
        eye1X = snakeX + eyeOffset;
        eye2X = snakeX + eyeOffset;
        eye1Y = snakeY + eyeOffset;
        eye2Y = snakeY + blockSize - eyeOffset;
    } else if (speedY === -1) {
        eye1X = snakeX + eyeOffset;
        eye2X = snakeX + blockSize - eyeOffset;
        eye1Y = snakeY + eyeOffset;
        eye2Y = snakeY + eyeOffset;
    } else {
        eye1X = snakeX + eyeOffset;
        eye2X = snakeX + blockSize - eyeOffset;
        eye1Y = snakeY + blockSize - eyeOffset;
        eye2Y = snakeY + blockSize - eyeOffset;
    }

    context.fillStyle = "black";
    context.beginPath();
    context.arc(eye1X, eye1Y, eyeSize, 0, 2 * Math.PI);
    context.fill();

    context.beginPath();
    context.arc(eye2X, eye2Y, eyeSize, 0, 2 * Math.PI);
    context.fill();
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && speedY != 1) {
        speedX = 0;
        speedY = -1;
    } else if (e.code == "ArrowDown" && speedY != -1) {
        speedX = 0;
        speedY = 1;
    } else if (e.code == "ArrowLeft" && speedX != 1) {
        speedX = -1;
        speedY = 0;
    } else if (e.code == "ArrowRight" && speedX != -1) {
        speedX = 1;
        speedY = 0;
    }
}

function placeFood() {
    do {
        foodX = Math.floor(Math.random() * total_col) * blockSize;
        foodY = Math.floor(Math.random() * total_row) * blockSize;
    } while (walls.some(wall => wall[0] === foodX && wall[1] === foodY));
}
