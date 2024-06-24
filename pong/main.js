const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;
const winningScore = 10;

let playerScore = 0;
let computerScore = 0;

const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white',
    dy: 0
};

const computer = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: 'white',
    dy: 4
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: ballSize,
    dx: 4,
    dy: 4,
    color: 'white',
    image: new Image()
};

const ballImages = {
    basketball: 'https://cdn.pixabay.com/photo/2013/07/12/14/07/basketball-147794_1280.png',
    football: 'https://cdn.pixabay.com/photo/2013/07/13/10/51/football-157930_1280.png',
    tennis: 'https://pixabay.com/static/frontend/3c346409d336d5f09a7f.svg',
    baseball: 'https://cdn.pixabay.com/photo/2013/07/13/10/51/baseball-157928_1280.png',
    soccer: 'https://pixabay.com/static/frontend/3c346409d336d5f09a7f.svg',
    volleyball: 'https://cdn.pixabay.com/photo/2012/04/05/01/48/volleyball-25782_1280.png',
    cricket: 'https://cdn.pixabay.com/photo/2014/03/24/17/15/cricket-ball-295206_1280.png',
    golf: 'https://cdn.pixabay.com/photo/2013/03/13/17/59/sport-93221_1280.png',
    rugby: 'https://cdn.pixabay.com/photo/2013/07/13/10/06/ball-156556_1280.png',
    pingpong: 'https://cdn.pixabay.com/photo/2013/07/12/15/02/ball-149289_1280.png'
};


const messages = [
    'Wow!', 'Excellent!', 'Great Shot!', 'Amazing!', 'Unbelievable!',
    'Incredible!', 'Nice!', 'Fantastic!', 'Superb!', 'Outstanding!'
];

document.getElementById('ballForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const selectedBall = document.querySelector('input[name="ball"]:checked').value;
    ball.image.src = ballImages[selectedBall];
    startGame();
});

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            player.dy = -6;
            break;
        case 'ArrowDown':
            player.dy = 6;
            break;
    }
});

document.addEventListener('keyup', (e) => {
    switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
            player.dy = 0;
            break;
    }
});

function movePaddle(paddle) {
    paddle.y += paddle.dy;

    if (paddle.y < 0) {
        paddle.y = 0;
    }

    if (paddle.y + paddle.height > canvas.height) {
        paddle.y = canvas.height - paddle.height;
    }
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = -ball.dx;
    ball.dy = 4 * (Math.random() * 2 - 1);
}

function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.y < 0 || ball.y + ball.size > canvas.height) {
        ball.dy *= -1;
    }

    if (ball.x < 0) {
        computerScore++;
        updateScoreBoard();
        resetBall();
    }

    if (ball.x + ball.size > canvas.width) {
        playerScore++;
        updateScoreBoard();
        resetBall();
    }

    if (ball.x < player.x + player.width &&
        ball.x + ball.size > player.x &&
        ball.y < player.y + player.height &&
        ball.y + ball.size > player.y) {
        ball.dx *= -1;
        displayRandomMessage();
    }

    if (ball.x < computer.x + computer.width &&
        ball.x + ball.size > computer.x &&
        ball.y < computer.y + computer.height &&
        ball.y + ball.size > computer.y) {
        ball.dx *= -1;
        displayRandomMessage();
    }
}

function moveComputer() {
    if (computer.y < ball.y) {
        computer.dy = 4;
    } else if (computer.y > ball.y) {
        computer.dy = -4;
    }

    movePaddle(computer);
}

function drawRect(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawBall(x, y, size, image) {
    context.drawImage(image, x, y, size, size);
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);
    drawBall(ball.x, ball.y, ball.size, ball.image);
}

function update() {
    movePaddle(player);
    moveBall();
    moveComputer();
}

function updateScoreBoard() {
    document.getElementById('playerScore').textContent = `Player: ${playerScore}`;
    document.getElementById('computerScore').textContent = `Computer: ${computerScore}`;
    checkWinner();
}

function checkWinner() {
    if (playerScore === winningScore) {
        setTimeout(() => {
            if (confirm('Player wins! Would you like to play again?')) {
                resetGame();
            }
        }, 100);
    } else if (computerScore === winningScore) {
        setTimeout(() => {
            if (confirm('Computer wins! Would you like to play again?')) {
                resetGame();
            }
        }, 100);
    }
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    updateScoreBoard();
    resetBall();
}

function displayRandomMessage() {
    const messageDiv = document.getElementById('message');
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    messageDiv.textContent = randomMessage;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 1000);
}

function startGame() {
    document.getElementById('ballSelection').style.display = 'none';
    canvas.style.display = 'block';
    document.getElementById('scoreBoard').style.display = 'flex';
    gameLoop();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}
