const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

let bird = { x: 50, y: 150, width: 20, height: 20, gravity: 2, lift: -30, velocity: 0 };
let pipes = [];
let score = 0;
let gameOver = false;

function drawBird() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
  ctx.fillStyle = "green";
  for (let p of pipes) {
    ctx.fillRect(p.x, 0, p.width, p.top);
    ctx.fillRect(p.x, canvas.height - p.bottom, p.width, p.bottom);
  }
}

function update() {
  if (gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  if (bird.y + bird.height > canvas.height || bird.y < 0) {
    endGame();
  }

  for (let i = 0; i < pipes.length; i++) {
    let p = pipes[i];
    p.x -= 2;

    if (
      bird.x < p.x + p.width &&
      bird.x + bird.width > p.x &&
      (bird.y < p.top || bird.y + bird.height > canvas.height - p.bottom)
    ) {
      endGame();
    }

    if (p.x + p.width < 0) {
      pipes.splice(i, 1);
      score++;
      document.getElementById("score").innerText = score;
    }
  }

  drawBird();
  drawPipes();
  requestAnimationFrame(update);
}

function jump() {
  if (!gameOver) {
    bird.velocity = bird.lift;
  }
}

function createPipe() {
  let top = Math.random() * (canvas.height / 2);
  let gap = 100;
  let bottom = canvas.height - top - gap;
  pipes.push({ x: canvas.width, width: 40, top: top, bottom: bottom });
}

function endGame() {
  gameOver = true;
  document.getElementById("score").innerText = "Game Over! Score: " + score;
  document.getElementById("restartBtn").style.display = "inline-block";
}

function restartGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  gameOver = false;
  document.getElementById("score").innerText = score;
  document.getElementById("restartBtn").style.display = "none";
  update();
}

document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump);

document.getElementById("restartBtn").addEventListener("click", restartGame);

setInterval(createPipe, 2000);
update();
