const canvas = document.querySelector("#game-board");
const ctx = canvas.getContext("2d");
const scoreBoard = document.querySelector("#score span");
const highScore = document.querySelector("#high-score span");
const savedScore = JSON.parse(localStorage.getItem("scoreLocalStorage"));

const framesPerSecond = 10;

const GRID_SIZE = 20;

let snakeBodyLength = 5;

let directionX = 0;
let directionY = 0;

let apple = {
  x: 0,
  y: 0,
};

let gameOver = true;

let score = 0;

let scoreLocalStorage = {
  lastRoundScore: 0,
  highScore: 0,
};

let snake = {
  body: [{ x: 200, y: 200 }],
  speed: 20,
};

const drawGameBoard = () => {
  for (let i = 0; i < canvas.height / GRID_SIZE; i++) {
    for (let j = 0; j < canvas.width / GRID_SIZE; j++) {
      if (i % 2 === 0) {
        if (j % 2 === 1) {
          ctx.fillStyle = "rgb(96, 108, 56)";
          ctx.fillRect(GRID_SIZE * j, GRID_SIZE * i, GRID_SIZE, GRID_SIZE);
        } else {
          ctx.fillStyle = "rgb(60, 100, 56)";
          ctx.fillRect(GRID_SIZE * j, GRID_SIZE * i, GRID_SIZE, GRID_SIZE);
        }
      } else if (i % 2 === 1) {
        if (j % 2 === 0) {
          ctx.fillStyle = "rgb(96, 108, 56)";
          ctx.fillRect(GRID_SIZE * j, GRID_SIZE * i, GRID_SIZE, GRID_SIZE);
        } else {
          ctx.fillStyle = "rgb(60, 100, 56)";
          ctx.fillRect(GRID_SIZE * j, GRID_SIZE * i, GRID_SIZE, GRID_SIZE);
        }
      }
    }
  }
};

const drawGameOver = () => {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgb(230, 230, 230)";
  ctx.lineWidth = 10;
  ctx.strokeRect(
    GRID_SIZE,
    GRID_SIZE,
    canvas.width - GRID_SIZE * 2,
    canvas.height - GRID_SIZE * 2
  );
  ctx.fillStyle = "rgb(230, 230, 230)";
  ctx.font = "100px VT323";
  ctx.fillText("Game Over", 117, canvas.height * 0.3);
  ctx.font = "36px VT323";
  ctx.fillText("Press Spacebar to start a New Game", 55, canvas.height * 0.45);
  ctx.font = "24px VT323";
  ctx.fillText(
    "* Use Arrow keys to control Snake *",
    132,
    canvas.height * 0.63
  );
  ctx.fillText("* Collect Apples to score points *", 137, canvas.height * 0.7);
  ctx.fillStyle = "red";
  ctx.font = "24px VT323";
  ctx.fillText(
    "<-- Avoid hitting the edges or your own tail! -->",
    65,
    canvas.height * 0.8
  );
};

const buildBody = () => {
  const snakeSegment = {
    x: snake.body[0].x,
    y: snake.body[0].y,
    width: GRID_SIZE,
    height: GRID_SIZE,
  };
  return snake.body.unshift(snakeSegment);
};

const drawBody = () => {
  buildBody();
  snake.body.forEach((elem) => {
    ctx.fillStyle = "rgb(221, 161, 94)";
    ctx.fillRect(elem.x, elem.y, elem.width, elem.height);
    ctx.strokeStyle = "rgb(241, 201, 114)";
    ctx.lineWidth = 1;
    ctx.strokeRect(elem.x, elem.y, elem.width, elem.height);
  });
  if (snake.body.length > snakeBodyLength) snake.body.pop();
};

const drawHead = () => {
  if (snake.body[0].x % GRID_SIZE === 0 && snake.body[0].y % GRID_SIZE === 0) {
    getDirection();
  }
  ctx.fillStyle = "rgb(221, 161, 94)";
  ctx.fillRect(
    (snake.body[0].x += snake.speed * directionX),
    (snake.body[0].y += snake.speed * directionY),
    GRID_SIZE,
    GRID_SIZE
  );
  ctx.strokeStyle = "rgb(241, 201, 114)";
  ctx.lineWidth = 1;
  ctx.strokeRect(snake.body[0].x, snake.body[0].y, GRID_SIZE, GRID_SIZE);
};

const getDirection = () => {
  window.addEventListener("keydown", (e) => {
    switch (e.code) {
      case "ArrowUp":
        console.log(directionX, directionY);
        directionX = 0;
        if (directionY === 1) {
          return;
        } else directionY = -1;
        break;
      case "ArrowDown":
        directionX = 0;
        if (directionY === -1) {
          return;
        } else directionY = 1;
        break;
      case "ArrowLeft":
        directionY = 0;
        if (directionX === 1) {
          return;
        } else directionX = -1;
        break;
      case "ArrowRight":
        directionY = 0;
        if (directionX === -1) {
          return;
        } else directionX = 1;
        break;
      default:
        console.log("Ignored");
        break;
    }
  });
};

const drawApple = () => {
  snake.body.forEach((part) => {
    if (apple.x === part.x && apple.y === part.y) generateRandomApplePosition();
  });
  ctx.fillStyle = "red";
  ctx.strokeStyle = "red";
  ctx.beginPath();
  ctx.arc(
    apple.x + GRID_SIZE / 2,
    apple.y + GRID_SIZE / 2,
    GRID_SIZE / 2,
    0,
    2 * Math.PI,
    true
  );
  ctx.stroke();
  ctx.fill();
};

function generateRandomApplePosition() {
  apple.x = Math.floor(Math.random() * (canvas.width / GRID_SIZE)) * GRID_SIZE;
  apple.y = Math.floor(Math.random() * (canvas.height / GRID_SIZE)) * GRID_SIZE;

  if (
    apple.x < GRID_SIZE ||
    apple.x === canvas.width - GRID_SIZE ||
    apple.y < GRID_SIZE ||
    apple.y === canvas.height - GRID_SIZE
  )
    generateRandomApplePosition();
}

const boundaryCheck = () => {
  if (snake.body[0].x < 0 || snake.body[0].x === canvas.width) {
    gameOver = true;
    snake.speed = -snake.speed;
  }
  if (snake.body[0].y < 0 || snake.body[0].y === canvas.height) {
    gameOver = true;
    snake.speed = -snake.speed;
  }
};

const appleCheck = () => {
  if (snake.body[0].x === apple.x && snake.body[0].y === apple.y) {
    generateRandomApplePosition();
    snakeBodyLength += 1;
    score++;
    scoreBoard.textContent = `SCORE: ${score}`;
  }
};

const bodyCheck = () => {
  snake.body.forEach((elem) => {
    bodyPosX = elem.bodyPosX;
    bodyPosY = elem.bodyPosY;
    if (directionX === 0 && directionY === 0) {
      return;
    } else if (snake.body[0].y === bodyPosY && snake.body[0].x === bodyPosX) {
      gameOver = true;
    }
  });
};

const createLocalStorage = () => {
  if (savedScore === null) {
    localStorage.setItem(
      "scoreLocalStorage",
      JSON.stringify(scoreLocalStorage)
    );
    document.location.reload();
  }
};

const displayLastRoundScore = () => {
  scoreBoard.textContent = `SCORE: ${savedScore.lastRoundScore}`;
  highScore.textContent = `HIGH SCORE: ${savedScore.highScore}`;
};

const checkGameOver = () => {
  if (gameOver) {
    scoreLocalStorage.lastRoundScore = score;
    scoreLocalStorage.highScore = savedScore.highScore;
    if (scoreLocalStorage.lastRoundScore > scoreLocalStorage.highScore) {
      scoreLocalStorage.highScore = scoreLocalStorage.lastRoundScore;
      localStorage.setItem(
        "scoreLocalStorage",
        JSON.stringify(scoreLocalStorage)
      );
    }
    localStorage.setItem(
      "scoreLocalStorage",
      JSON.stringify(scoreLocalStorage)
    );
    document.location.reload();
  }
};

window.addEventListener("keydown", (e) => {
  if (gameOver && e.code === "Space") {
    gameOver = false;
    playGame();
    score = 0;
  }
});

const playGame = () => {
  setInterval(function () {
    drawGameBoard();
    drawApple();
    drawBody();
    drawHead();
    boundaryCheck();
    appleCheck();
    bodyCheck();
    checkGameOver();
  }, 1000 / framesPerSecond);
  generateRandomApplePosition();
};

window.onload = () => {
  createLocalStorage();
  drawGameBoard();
  drawGameOver();
  displayLastRoundScore();
};
