const gameState = {
    start: "start",
    running: "running",
    finish: "finish",
};
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const interval = 100;
const taille = 20;
const img = new Image();
img.src = "apple.png";
canvas.width = 400;
canvas.height = 400;
const closeModalButton = document.getElementById("close-modal");
const restartModalButton = document.getElementById("restart-modal");
const modalOverlay = document.querySelector(".modal-overlay");
let dx = 10;
let dy = 0;
let gameStarted = gameState.start;
let scoreboard = 0;
let snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 },
];
const rect = {
    x: 100,
    y: 125,
    width: 200,
    height: 100,
};
const showScore = () => {
    document.getElementById("score").innerHTML = scoreboard;
    document.getElementById("score-visuel").innerHTML = scoreboard;
};
const newApple = () => {
    return {
        x: Math.floor(Math.random() * (canvas.width / taille)) * taille,
        y: Math.floor(Math.random() * (canvas.height / taille)) * taille,
    };
};
var fruit = newApple();
const blockScroll = () => {
    const body = document.getElementById("body");
    if (gameStarted === gameState.running) {
        body.classList.add("body");
    } else {
        body.classList.remove("body");
    }
};
document.addEventListener("keydown", (e) => {
    if (gameStarted === gameState.start) {
        startGame();
        return;
    }
    switch (e.key) {
        case "ArrowUp":
            dx = 0;
            dy = -10;
            return;
        case "ArrowDown":
            dx = 0;
            dy = 10;
            return;
        case "ArrowLeft":
            dx = -10;
            dy = 0;
            return;
        case "ArrowRight":
            dx = 10;
            dy = 0;
            return;
    }
});
const startGame = () => {
    snake = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 },
        { x: 170, y: 200 },
        { x: 160, y: 200 },
    ];
    dx = 10;
    dy = 0;
    gameStarted = gameState.running;
    scoreboard = 0;
    showScore();
    drawApple();
    blockScroll();
    setTimeout(main, interval);
};

const drawSnake = () => {
    for (var i = 0; i < snake.length; i++) {
        ctx.fillStyle = "#IUIUIU";
        ctx.fillRect(snake[i].x, snake[i].y, 10, 10);
    }
};
const drawApple = () => {
    ctx.drawImage(img, fruit.x, fruit.y);
};
const moveSnake = () => {
    snake.pop();
    snake.unshift({ x: snake[0].x + dx, y: snake[0].y + dy });
};
const checkCollision = () => {
    if (
        snake[0].x < 0 ||
        snake[0].x >= canvas.width ||
        snake[0].y < 0 ||
        snake[0].y >= canvas.height
    ) {
        gameOver();
    }
    for (var i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            gameOver();
        }
    }
    if (snake[0].x === fruit.x && snake[0].y === fruit.y) {
        snake.unshift(fruit);
        fruit = newApple();
        scoreboard++;
        showScore();
    }
};
const gameOver = () => {
    gameStarted = gameState.finish;
    blockScroll();
    modalOverlay.classList.add("show");
};
const getMousePos = (canvas, event) => {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
    };
};
const isInside = (pos, rect) => {
    return (
        pos.x > rect.x &&
        pos.x < rect.x + rect.width &&
        pos.y < rect.y + rect.height &&
        pos.y > rect.y
    );
};
const playbutton = (rect) => {
    ctx.beginPath();
    ctx.rect(rect.x, rect.y, rect.width, rect.height);
    ctx.fillStyle = "rgb(240,248,255)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#000000";
    ctx.stroke();
    ctx.closePath();
    ctx.font = "40pt Kremlin Pro Web";
    ctx.fillStyle = "#000000";
    ctx.fillText("Start", rect.x + rect.width / 4, rect.y + 64);
};
const main = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    moveSnake();
    checkCollision();
    drawApple();
    drawSnake();
    if (gameStarted === gameState.running) {
        setTimeout(main, interval);
    }
};
closeModalButton.addEventListener("click", function () {
    modalOverlay.classList.remove("show");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    playbutton(rect);
    scoreboard = 0;
    showScore();
});
restartModalButton.addEventListener("click", function () {
    modalOverlay.classList.remove("show");
    startGame();
});
canvas.addEventListener(
    "click",
    (evt) => {
        if (isInside(getMousePos(canvas, evt), rect)) {
            startGame();
        }
    },
    false
);
playbutton(rect);
