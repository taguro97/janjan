
//#########################################
// ############# Variables ###############
//#########################################

let GRID_SIZE = 16;

let lastRender = 0;
let SNAKE_SPEED = 2;

const snakeBody = [{ x: 8, y: 8 }];
let newSegments = 0;

let applePosition = getRandomApplePosition();

const gameBoard = document.getElementById("game-board");

let inputDirection = { x: 0, y: 0 };
let lastInputDirection = { x: 0, y: 0 };

let gameOver = false;

let score = 0;

const scoreBox = document.getElementById("score");

//#########################################
// ########### ScoreBox Code ##############
//#########################################

function drawScore() {
  scoreBox.innerText = score;
}

function updateScore() {
  score += 10;
}

//#########################################
// ######## InputDircetion Code ###########
//#########################################

window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (lastInputDirection.y != 0) break;
      inputDirection = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (lastInputDirection.y != 0) break;
      inputDirection = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (lastInputDirection.x != 0) break;
      inputDirection = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (lastInputDirection.x != 0) break;
      inputDirection = { x: 1, y: 0 };
      break;
  }
});

function getInputDirection() {
  lastInputDirection = inputDirection;
  return inputDirection;
}

//#########################################
// ############# Apple Code ###############
//#########################################

function updateApple() {
  if (isOnSanke(applePosition)) {
    updateScore();
    drawScore();
    applePosition = getRandomApplePosition();
    expandSnake();
  }
}

function drawApple() {
  const appleElemnt = document.createElement("div");
  appleElemnt.style.gridRowStart = applePosition.y;
  appleElemnt.style.gridColumnStart = applePosition.x;
  appleElemnt.classList.add("apple");
  gameBoard.appendChild(appleElemnt);
}

function getRandomApplePosition() {
  let newApplePostion;

  while (newApplePostion == null || isOnSanke(newApplePostion)) {
    newApplePostion = generateRandomGridPostion();
  }

  return newApplePostion;
}

function generateRandomGridPostion() {
  return {
    x: Math.floor(Math.random() * GRID_SIZE + 1),
    y: Math.floor(Math.random() * GRID_SIZE + 1),
  };
}
//#########################################
// ############# Snake Code ###############
//#########################################

function updateSnake() {
  addSnakeSegemnts();
  const inputDirection = getInputDirection();
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }

  snakeBody[0].x += inputDirection.x;
  snakeBody[0].y += inputDirection.y;
}

function drawSnake() {
  snakeBody.forEach((snakeSegment, index) => {
    const snakeElement = document.createElement("div");
    if (index === 0) {
      snakeElement.classList.add("snakeHead");
      flipHead(snakeElement);
    } else {
      snakeElement.classList.add("snakeSegment");
    }

    snakeElement.style.gridRowStart = snakeSegment.y;
    snakeElement.style.gridColumnStart = snakeSegment.x;

    gameBoard.appendChild(snakeElement);
  });
}

function flipHead(snakeHead) {
  if (lastInputDirection.x === 0 && lastInputDirection.y === 1) {
    snakeHead.style.transform = "rotate(0deg)";
  } else if (lastInputDirection.x === 0 && lastInputDirection.y === -1) {
    snakeHead.style.transform = "rotate(180deg)";
  } else if (lastInputDirection.x === -1 && lastInputDirection.y === 0) {
    snakeHead.style.transform = "rotate(90deg)";
    snakeHead.style.transform += " translateX(-22%)";
  } else if (lastInputDirection.x === 1 && lastInputDirection.y === 0) {
    snakeHead.style.transform = "rotate(-90deg)";
    snakeHead.style.transform += " translateX(22%)";
  }
}

function isOnSanke(applePosition, { ignoreHead = false } = {}) {
  return snakeBody.some((snakeSegment, index) => {
    if (ignoreHead && index === 0) return false;
    return (
      snakeSegment.x === applePosition.x && snakeSegment.y === applePosition.y
    );
  });
}

function expandSnake() {
  newSegments++;
}

function addSnakeSegemnts() {
  for (let i = 0; i < newSegments; i++) {
    snakeBody.push({ ...snakeBody[snakeBody.length - 1] });
  }
  newSegments = 0;
}

function isSnakeIntersecting() {
  return isOnSanke(snakeBody[0], { ignoreHead: true });
}

function checkDeath() {
  gameOver = isSnakeIntersecting() || isOutsideGrid();
}

//#########################################
// ############# Grid Code ###############
//#########################################

function isOutsideGrid() {
  return (
    snakeBody[0].x < 1 ||
    snakeBody[0].x > GRID_SIZE ||
    snakeBody[0].y < 1 ||
    snakeBody[0].y > GRID_SIZE
  );
}

//#########################################
// ############# Main Code ###############
//#########################################
function main(currentTime) {
  if (gameOver) {
    if (confirm("Game Over, Click Okay to Restart")) {
      window.location = "/";
    }
    return;
  }

  window.requestAnimationFrame(main);

  const secondsSinceLastRender = (currentTime - lastRender) / 1000;

  if (secondsSinceLastRender < 1 / SNAKE_SPEED) return;

  lastRender = currentTime;

  draw();
  update();
}

window.requestAnimationFrame(main);

function draw() {
  gameBoard.innerHTML = "";
  drawSnake();
  drawApple();
}

function update() {
  updateSnake();
  updateApple();
  checkDeath();
}
