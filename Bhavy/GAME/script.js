// Game variables
let gameStarted = false;
let player = {
    x: 50,
    y: 300,
    width: 30,
    height: 40,
    velocityY: 0,
    isJumping: false
};

// Get DOM elements
const gameContainer = document.querySelector('.game');
const blocks = document.querySelectorAll('.block');

// Initialize game
function initGame() {
    gameStarted = true;
    console.log('Game started!');
    
    // Add player element
    createPlayer();
    
    // Start game loop
    gameLoop();
}

// Create player element
function createPlayer() {
    const playerElement = document.createElement('div');
    playerElement.id = 'player';
    playerElement.style.cssText = `
        position: absolute;
        width: ${player.width}px;
        height: ${player.height}px;
        background: #ff6b6b;
        border: 2px solid #c44569;
        border-radius: 5px;
        left: ${player.x}px;
        top: ${player.y}px;
        z-index: 10;
    `;
    document.body.appendChild(playerElement);
}

// Game loop
function gameLoop() {
    if (!gameStarted) return;
    
    updatePlayer();
    checkCollisions();
    
    requestAnimationFrame(gameLoop);
}

// Update player position
function updatePlayer() {
    const playerElement = document.getElementById('player');
    if (!playerElement) return;
    
    // Apply gravity
    player.velocityY += 0.8;
    player.y += player.velocityY;
    
    // Update player position
    playerElement.style.top = player.y + 'px';
    playerElement.style.left = player.x + 'px';
}

// Check collisions with blocks
function checkCollisions() {
    blocks.forEach(block => {
        const blockRect = block.getBoundingClientRect();
        const playerRect = document.getElementById('player')?.getBoundingClientRect();
        
        if (playerRect && isColliding(playerRect, blockRect)) {
            // Land on block
            player.y = blockRect.top - player.height;
            player.velocityY = 0;
            player.isJumping = false;
        }
    });
}

// Collision detection
function isColliding(rect1, rect2) {
    return rect1.left < rect2.right &&
           rect1.right > rect2.left &&
           rect1.top < rect2.bottom &&
           rect1.bottom > rect2.top;
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (!gameStarted) {
        initGame();
        return;
    }
    
    const playerElement = document.getElementById('player');
    if (!playerElement) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            player.x -= 5;
            break;
        case 'ArrowRight':
            player.x += 5;
            break;
        case ' ':
        case 'ArrowUp':
            if (!player.isJumping) {
                player.velocityY = -15;
                player.isJumping = true;
            }
            break;
    }
});

// Click to start game
document.addEventListener('click', () => {
    if (!gameStarted) {
        initGame();
    }
});

console.log('Game script loaded!'); 