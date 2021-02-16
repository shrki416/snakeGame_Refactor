const gameDisplay = document.getElementById("game-display");
const ctx = gameDisplay.getContext("2d");
const score = document.getElementById("score");

let displayWidth = gameDisplay.width;
let displayHeight = gameDisplay.height;

let GRID_SIZE = 10;

let isRightPressed = false;
let isLeftPressed = false;
let isUpPressed = false;
let isDownPressed = false;
let pointsCount = null;
let isAppleEaten = false;
let isGameOver = false;

let currPositionsHead = [];

let rightClick = null;
let leftClick = null;
let upClick = null;
let downClick = null;

class Snake {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  drawSnake() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
  }
}

class Apple {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }
  drawApple() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }
}

const getRandomAppleX = () => {
  let randomAppleX = Math.floor(Math.random() * (390 / 10)) * 10 + 10;
  if (randomAppleX === 0 || randomAppleX === 10 || randomAppleX === 390) {
    randomAppleX = Math.floor(Math.random() * (390 / 10)) * 10 + 10;
  }
  return randomAppleX;
};

const getRandomAppleY = () => {
  let randomAppleY = Math.floor(Math.random() * (290 / 10)) * 10 + 10;
  if (randomAppleY === 0 || randomAppleY === 10 || randomAppleY === 290) {
    randomAppleY = Math.floor(Math.random() * (290 / 10)) * 10 + 10;
  }
  return randomAppleY;
};

const apple = new Apple(getRandomAppleX(), getRandomAppleY(), 5);

const snake = {
  body: [new Snake(40, 140, 5), new Snake(30, 140, 5)],
  currentPositionHead: [],
  prevPositionHead: [],
};

let snakeHead = snake.body[0];

const applePlacement = () => {
  for (let i = 0; i < snake.body.length; i++) {
    if (
      apple.x === snakeHead.x ||
      (apple.x === snake.body[i].x && apple.y === snakeHead.y) ||
      apple.y === snake.body[i].y
    ) {
      apple.x = getRandomAppleX();
      apple.y = getRandomAppleY();
    }
  }
};

applePlacement();

const createSnakeAndApple = () => {
  snakeHead.drawSnake();
  for (let i = 0; i < snake.body.length; i++) {
    snake.body[i].drawSnake();
  }
  apple.drawApple();
};

window.onload = () => {
  createSnakeAndApple();
};

const snakeMovement = () => {
  currPositionsHead.push([snakeHead.x, snakeHead.y]);
  snake.currentPositionHead = currPositionsHead[currPositionsHead.length - 1];
  snake.prevPositionHead = currPositionsHead[currPositionsHead.length - 2];

  if (snake.prevPositionHead) {
    snake.body.push(
      new Snake(snake.prevPositionHead[0], snake.prevPositionHead[1], 5)
    );
    if (snake.body.length > pointsCount + 1) {
      snake.body.shift();
    }
  }
  ctx.clearRect(0, 0, displayWidth, displayHeight);
  createSnakeAndApple();
};

const directionSnake = {
  right: () => {
    snakeMovement(), (snakeHead.x += GRID_SIZE), (currentY = snakeHead.y);
  },
  left: () => {
    snakeMovement(), (snakeHead.x += -GRID_SIZE), (currentY = snakeHead.y);
  },
  up: () => {
    snakeMovement(), snakeHead.x, (currentY = snakeHead.y += -GRID_SIZE);
  },
  down: () => {
    snakeMovement(), snakeHead.x, (currentY = snakeHead.y += GRID_SIZE);
  },
};

const clearIntervalsRightLeft = (interval) => {
  if (isUpPressed === true || isDownPressed === true) {
    clearInterval(interval);
  }
};

const clearIntervalsUpDown = (interval) => {
  if (isRightPressed === true || isLeftPressed === true) {
    clearInterval(interval);
  }
};

const rightInterval = () => {
  const rightInt = setInterval(() => {
    directionSnake.right();
    gameOverIfSnakeHitsTheWall(rightInt);
    gameOverIfSnakeHitsHimself(rightInt);
    snakeEatsTheApple();
    clearIntervalsRightLeft(rightInt);
    isRightPressed = false;
  }, 100);
};

const leftInterval = () => {
  const leftInt = setInterval(() => {
    directionSnake.left();
    gameOverIfSnakeHitsTheWall(leftInt);
    gameOverIfSnakeHitsHimself(leftInt);
    snakeEatsTheApple();
    clearIntervalsRightLeft(leftInt);
    isLeftPressed = false;
  }, 100);
};

const upInterval = () => {
  const upInt = setInterval(() => {
    directionSnake.up();
    gameOverIfSnakeHitsTheWall(upInt);
    gameOverIfSnakeHitsHimself(upInt);
    snakeEatsTheApple();
    clearIntervalsUpDown(upInt);
    isUpPressed = false;
  }, 100);
};

const downInterval = () => {
  const downInt = setInterval(() => {
    directionSnake.down();
    gameOverIfSnakeHitsTheWall(downInt);
    gameOverIfSnakeHitsHimself(downInt);
    snakeEatsTheApple();
    clearIntervalsUpDown(downInt);
    isDownPressed = false;
  }, 100);
};

const snakeMoves = (e) => {
  if (isGameOver === false) {
    if (e.keyCode === 39) {
      rightClick++;
      leftClick = 1;
      upClick = null;
      downClick = null;
      if (rightClick === 1) {
        isRightPressed = true;
        rightInterval();
      }
    } else if (e.keyCode === 37) {
      leftClick++;
      rightClick = 1;
      upClick = null;
      downClick = null;
      if (leftClick === 1) {
        isLeftPressed = true;
        leftInterval();
      }
    } else if (e.keyCode === 38) {
      upClick++;
      downClick = 1;
      rightClick = null;
      leftClick = null;
      if (upClick === 1) {
        isUpPressed = true;
        upInterval();
      }
    } else if (e.keyCode === 40) {
      downClick++;
      upClick = 1;
      rightClick = null;
      leftClick = null;
      if (downClick === 1) {
        isDownPressed = true;
        downInterval();
      }
    }
  }
};

document.addEventListener("keydown", snakeMoves);

const gameOverIfSnakeHitsTheWall = (interval) => {
  if (
    snakeHead.x + GRID_SIZE > displayWidth - snakeHead.radius ||
    snakeHead.x + GRID_SIZE < snakeHead.radius ||
    snakeHead.y + GRID_SIZE > displayHeight - snakeHead.radius ||
    snakeHead.y + GRID_SIZE < snakeHead.radius
  ) {
    clearInterval(interval);
    score.textContent = "GAME OVER!";
    isGameOver = true;
  }
};

const getDistance = (x1, y1, x2, y2) => {
  let x = x2 - x1;
  let y = y2 - y1;
  let distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
  return distance;
};

const snakeEatsTheApple = () => {
  if (
    getDistance(apple.x, apple.y, snakeHead.x, snakeHead.y) <
    apple.radius + snakeHead.radius
  ) {
    apple.x = getRandomAppleX();
    apple.y = getRandomAppleY();
    pointsCount++;
    score.textContent = `SCORE : ${pointsCount}`;
  }
};

const gameOverIfSnakeHitsHimself = (interval) => {
  snake.body.slice(2).forEach((piece) => {
    if (
      getDistance(piece.x, piece.y, snakeHead.x, snakeHead.y) <
      piece.radius + snakeHead.radius
    ) {
      clearInterval(interval);
      score.textContent = "GAME OVER!";
    }
  });
};

const playAgain = () => {
  document.location.reload();
  pointsCount = 0;
};

const btn = document.getElementById("play-again-btn");
btn.addEventListener("click", playAgain);
