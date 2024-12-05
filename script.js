const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const box = 20;  // Size of each box
const canvasSize = 400 / box;  // Number of boxes in one row/column

let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };

let food = {
    x: Math.floor(Math.random() * canvasSize) * box,
    y: Math.floor(Math.random() * canvasSize) * box
};

let d;
let score = 0;
let speed = 50;  // Initial speed of the game
let gameInterval;

document.addEventListener('keydown', direction);
document.getElementById('restartButton').addEventListener('click', restartGame);

function direction(event) {
    if (event.key === 'ArrowUp' && d !== 'DOWN') d = 'UP';
    if (event.key === 'ArrowDown' && d !== 'UP') d = 'DOWN';
    if (event.key === 'ArrowLeft' && d !== 'RIGHT') d = 'LEFT';
    if (event.key === 'ArrowRight' && d !== 'LEFT') d = 'RIGHT';
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'white';  // Head is green, body is white
        ctx.beginPath();
        ctx.arc(snake[i].x + box / 2, snake[i].y + box / 2, box / 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(food.x + box / 2, food.y + box / 2, box / 2, 0, Math.PI * 2);
    ctx.fill();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === 'LEFT') snakeX -= box;
    if (d === 'RIGHT') snakeX += box;
    if (d === 'UP') snakeY -= box;
    if (d === 'DOWN') snakeY += box;

    // Check if the snake has eaten the food
    if (snakeX === food.x && snakeY === food.y) {
        food = {
            x: Math.floor(Math.random() * canvasSize) * box,
            y: Math.floor(Math.random() * canvasSize) * box
        };
        score++;
        if (score % 5 === 0) {
            speed = Math.max(20, speed - 10);  // Increase speed, but not too fast
            clearInterval(gameInterval);
            gameInterval = setInterval(draw, speed);
        }
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Check for collisions with walls or self
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(gameInterval);
        document.getElementById('restartButton').style.display = 'block';
        alert(`Game Over! Your Score: ${score}`);
        return;
    }

    snake.unshift(newHead);
}

function restartGame() {
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    food = {
        x: Math.floor(Math.random() * canvasSize) * box,
        y: Math.floor(Math.random() * canvasSize) * box
    };
    d = '';
    score = 0;
    speed = 100;
    document.getElementById('restartButton').style.display = 'none';
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, speed);
}

gameInterval = setInterval(draw, speed);
