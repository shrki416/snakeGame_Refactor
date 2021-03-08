const canvas = document.querySelector("#game-board");
const ctx = canvas.getContext("2d");

const FRAMES_PER_SECOND = 10;
const GRID_SIZE = 20;

let score = 0;
let gameOver = true;

const scoreBoard = document.querySelector("#score span");
const highScore = document.querySelector("#high-score span");
const savedScore = JSON.parse(localStorage.getItem("scoreLocalStorage"));

let apple = {
  x: 0,
  y: 0,
};

let scoreLocalStorage = {
  lastRoundScore: 0,
  highScore: 0,
};

let snake = {
  body: [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 },
    { x: 140, y: 200 },
    { x: 120, y: 200 },
  ],
  direction: undefined,
  // speed: 20,
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

// const buildBody = () => {
//   const snakeSegment = new SnakeBodySegment(
//     snake.body[0].x,
//     snake.body[0].y,
//     GRID_SIZE
//   );
//   return snake.body.unshift(snakeSegment);
// };

// const drawBody = () => {
//   buildBody();
//   snake.body.forEach((elem) => {
//     ctx.fillStyle = "rgb(221, 161, 94)";
//     ctx.fillRect(elem.snakeX, elem.snakeY, elem.width, elem.height);
//     ctx.strokeStyle = "rgb(241, 201, 114)";
//     ctx.lineWidth = 1;
//     ctx.strokeRect(elem.snakeX, elem.snakeY, elem.width, elem.height);
//   });
//   if (snake.body.length > snake.length) snake.body.pop();
// };

function drawSnake() {
  ctx.fillStyle = "rgb(221, 161, 94)";
  ctx.fillRect(snake.body[0].x, snake.body[0].y, GRID_SIZE, GRID_SIZE);
  ctx.strokeStyle = "rgb(241, 201, 114)";

  for (const part of snake.body) {
    ctx.fillRect(part.x, part.y, GRID_SIZE, GRID_SIZE);
  }
}

class SnakeBodySegment {
  constructor(bodyPosX, bodyPosY, elementSize) {
    this.snakeX = bodyPosX;
    this.snakeY = bodyPosY;
    this.width = elementSize;
    this.height = elementSize;
  }
}

// const drawHead = () => {
//   if (snake.x % GRID_SIZE === 0 && snake.y % GRID_SIZE === 0) {
//     getDirection();
//   }
//   ctx.fillStyle = "rgb(221, 161, 94)";
//   ctx.fillRect(
//     (snake.x += GRID_SIZE * snake.directionX),
//     (snake.y += GRID_SIZE * snake.directionY),
//     GRID_SIZE,
//     GRID_SIZE
//   );
//   ctx.strokeStyle = "rgb(241, 201, 114)";
//   ctx.lineWidth = 1;
//   ctx.strokeRect(snake.x, snake.y, GRID_SIZE, GRID_SIZE);
// };

//this should be called moveSnake()
function getDirection() {
  if (!snake.direction) return;

  for (let i = snake.body.length - 1; i > 0; i--) {
    const parent = snake.body[i - 1];
    snake.body[i] = new SnakeBodySegment(parent.x, parent.y, GRID_SIZE);
  }
  switch (snake.direction) {
    case "ArrowUp":
      snake.body[0].y -= GRID_SIZE;
      break;
    case "ArrowDown":
      snake.body[0].y += GRID_SIZE;
      break;
    case "ArrowRight":
      snake.body[0].x += GRID_SIZE;
      break;
    case "ArrowLeft":
      snake.body[0].x -= GRID_SIZE;
      break;
  }
}

// const getDirection = () => {
//   window.addEventListener("keydown", (e) => {
//     switch (e.code) {
//       case "ArrowUp":
//         snake.directionX = 0;
//         if (snake.directionY === 1) {
//           return;
//         } else snake.directionY = -1;
//         break;
//       case "ArrowDown":
//         snake.directionX = 0;
//         if (snake.directionY === -1) {
//           return;
//         } else snake.directionY = 1;
//         break;
//       case "ArrowLeft":
//         snake.directionY = 0;
//         if (snake.directionX === 1) {
//           return;
//         } else snake.directionX = -1;
//         break;
//       case "ArrowRight":
//         snake.directionY = 0;
//         if (snake.directionX === -1) {
//           return;
//         } else snake.directionX = 1;
//         break;
//       default:
//         console.log("Ignored");
//         break;
//     }
//   });
// };

const drawApple = () => {
  snake.body.forEach(({ snakeX, snakeY }) => {
    if (apple.x === snakeX && apple.y === snakeY) {
      getRandomApplePosition();
    } else {
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
    }
  });
};

function getRandomApplePosition() {
  apple.x = Math.floor(Math.random() * (canvas.width / GRID_SIZE)) * GRID_SIZE;
  apple.y = Math.floor(Math.random() * (canvas.height / GRID_SIZE)) * GRID_SIZE;
  if (
    apple.x < GRID_SIZE ||
    apple.x === canvas.width - GRID_SIZE ||
    apple.y < GRID_SIZE ||
    apple.y === canvas.height - GRID_SIZE
  ) {
    getRandomApplePosition();
  }
}

const boundaryCheck = () => {
  if (
    snake.body[0].x < 0 ||
    snake.body[0].x === canvas.width ||
    snake.body[0].y < 0 ||
    snake.body[0].y === canvas.height
  ) {
    gameOver = true;
  }
};

const appleCheck = () => {
  if (snake.x === apple.x && snake.y === apple.y) {
    getRandomApplePosition();
    score++;
    scoreBoard.textContent = `SCORE: ${score}`;
  }
};

const bodyCheck = () => {
  for (let i = 1; i < snake.body.length; i++) {
    if (
      snake.body[0].x === snake.body[i].x &&
      snake.body[0].y === snake.body[i].y
    ) {
      return true;
    }
  }
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
  switch (e.code) {
    case "ArrowUp":
      if (snake.direction !== "ArrowDown") snake.direction = "ArrowUp";
      break;
    case "ArrowDown":
      if (snake.direction !== "ArrowUp") snake.direction = "ArrowDown";
      break;
    case "ArrowRight":
      if (snake.direction !== "ArrowLeft") snake.direction = "ArrowRight";
      break;
    case "ArrowLeft":
      if (snake.direction !== "ArrowRight") snake.direction = "ArrowLeft";
      break;
    case "Space":
      if (gameOver) {
        gameOver = false;
        playGame();
        score = 0;
      }
      break;
  }
});

const playGame = () => {
  setInterval(function () {
    drawGameBoard();
    drawApple();
    drawSnake();
    getDirection();
    // drawBody();
    // drawHead();
    boundaryCheck();
    appleCheck();
    bodyCheck();
    checkGameOver();
  }, 1000 / FRAMES_PER_SECOND);
  getRandomApplePosition();
};

window.onload = () => {
  createLocalStorage();
  drawGameBoard();
  drawGameOver();
  displayLastRoundScore();
};
