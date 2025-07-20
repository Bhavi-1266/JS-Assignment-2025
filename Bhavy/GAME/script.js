document.addEventListener('DOMContentLoaded', function() {
    let blocks = document.querySelectorAll('.block');
    let cloudBlocks = document.querySelectorAll('.cloudBlock');
    let startingText = document.querySelector('.startingText');
    let startButton = document.querySelector('#startButton');
    let game = document.querySelector('.game');
    let h1 = document.querySelector('h1');


    //coins stuff
    let coinCollected =0;
    let Highscore=0;

    if (localStorage.getItem('gameHighScore')) {
        Highscore = parseInt(localStorage.getItem('gameHighScore'), 10) || 0;
        const highScoreDiv = document.getElementById("highScore");
        if (highScoreDiv) {
            highScoreDiv.textContent = `High Score : ${Highscore}`;
        }
    }

    function updateHighScore(newScore) {
        Highscore = newScore;
        localStorage.setItem('gameHighScore', Highscore);
        const highScoreDiv = document.getElementById("highScore");
        if (highScoreDiv) {
            highScoreDiv.textContent = `High Score : ${Highscore}`;
        }
    }

    
    let cameraX=0;
    let cameraSpeed=0.3;
    let cameraAcc=0.001;

    let CoinProbability = 0.1; // 10% chance to spawn a coin
    let AirCoinProbability = 0.05; // 5% chance to spawn an air coin

    //  Loudness setup
    let audioContext, analyser, microphone, dataArray;
    let loudJumpThreshold = 5; 
    let lastJumpTime = 0;
    let jumpCooldown = 10; 

    let doubleJumpUsed = false;

    let score = 0;

   

    // For demo: Uncomment to test score increment every 2 seconds
    // setInterval(collectCoin, 2000);

    function setupAudio() {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(function(stream) {
                    audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    analyser = audioContext.createAnalyser();
                    microphone = audioContext.createMediaStreamSource(stream);
                    microphone.connect(analyser);
                    analyser.fftSize = 256;
                    dataArray = new Uint8Array(analyser.frequencyBinCount);
                    detectLoudness();
                })
                .catch(function(err) {
                    console.error('Microphone error:', err);
                });
        } else {
            alert('getUserMedia not supported in this browser.');
        }
    }

    setupAudio();
    function detectLoudness() {
        analyser.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            let val = (dataArray[i] - 128) / 128;
            sum += val * val;
        }
        let rms = Math.sqrt(sum / dataArray.length);
        let volume = rms * 100;

        let now = Date.now();
        if (volume > loudJumpThreshold && now - lastJumpTime > jumpCooldown) {
            if (isOnGround > 0) {
                jump(volume**2);
            } else if (isOnGround === 1 && !doubleJumpUsed) {
                doubleJump();
                doubleJumpUsed = true;
            }
            lastJumpTime = now;
        }

        requestAnimationFrame(detectLoudness);
    }

    let Player = document.createElement('div');
    Player.style.width = '0.6rem';
    Player.style.height = '0.6rem';
    Player.style.backgroundColor = 'orange';
    Player.style.position = 'absolute';
    Player.style.left = '60px';
    Player.style.top = '300px';
    Player.style.borderRadius = '50%';
    Player.style.zIndex = '2';
    document.body.appendChild(Player);

    let xSpeed = 0;
    let ySpeed = 0;
    let g = 0.08;
    let Yacc = g;
    let Xacc = -0.007;
    let isOnGround = 0;
    let x = 60;
    let y = 300;

    function jump(holdTime = 0) {
        if (holdTime > 2000) {
            holdTime = 2000; t
        }
        if (isOnGround > 0) {
            ySpeed = -1.5 - (holdTime / 200);
            xSpeed = 0.8 + (holdTime / 400);
            isOnGround--;
        }

    }

    function doubleJump() {
        if (isOnGround === 1 && !doubleJumpUsed) {
            ySpeed = -2.7; 
            xSpeed = 1.3;
            isOnGround--;
            doubleJumpUsed = true;
        }
    }

    let keyDownTime = 0;

    document.addEventListener('keydown', (key) => {
        if (key.code === 'Space') {
            if (!key.repeat && isOnGround > 0) {
                keyDownTime = Date.now();
            }
            else if (isOnGround === 1 && !doubleJumpUsed) {
                doubleJump();
            }
        }
    });

    document.addEventListener('keyup', (key) => {
        if (key.code === 'Space') {
            let keyHoldDuration = Date.now() - keyDownTime;
            if (isOnGround > 0) {
                jump(keyHoldDuration);
            }
        }
    });

    function moving() {
        ySpeed += Yacc;
        y += ySpeed;

        if (!(xSpeed > -0.2 && xSpeed < 0.1)) {
            xSpeed += Xacc;
            x += xSpeed;
            Player.style.left = x + 'px';
        }

        Player.style.top = y + 'px';

        if (y + Player.offsetHeight >= window.innerHeight) {
            y = window.innerHeight - Player.offsetHeight;
            ySpeed = 0;
            xSpeed=0;
            Player.style.top = y + 'px';
            if (h1) h1.innerText = 'HAHAHA YOU LOOSE';
        }

        if (x + Player.offsetWidth >= window.innerWidth) {
            // x = window.innerWidth - Player.offsetWidth;
             // Bounce back 
            
        // If player crosses the right boundary, wrap to left edge with same speed and height
        x = 0;
        Player.style.left = x + 'px';
          
            
        }

        cloudBlocks.forEach((block, index) => {
            let rect = block.getBoundingClientRect();
            let playerBottom = y + Player.offsetHeight;
            let playerLeft = x;
            let playerRight = x + Player.offsetWidth;
            //above colison
            if (
                playerBottom >= rect.top &&
                playerBottom <= rect.top + 10 &&
                playerRight > rect.left &&
                playerLeft < rect.right
            ) {
                if (ySpeed > 0) {
                    y = rect.top - Player.offsetHeight;
                    ySpeed = 0;
                    Player.style.top = y + 'px';
                    isOnGround = 2;
                    doubleJumpUsed = false; 
                }
                if (xSpeed>0){
                    xSpeed=xSpeed/1.043;
                }
                if(index===18){
                    if (h1) h1.innerText = 'YOU WONNNNN';
                }
            }
            //botton colison
    
            let playerTop = y;
            if (
                playerTop <= rect.bottom &&
                playerTop >= rect.bottom - 10 &&
                playerRight > rect.left &&
                playerLeft < rect.right
            ) {
                ySpeed = -ySpeed * 0.1; 
            }
            // Side collision 
            if (
                playerRight >= rect.left &&
                playerLeft <= rect.right &&
                y + Player.offsetHeight > rect.top &&
                y < rect.bottom
            ) {
                if (xSpeed > 0) {
                    x = rect.left - Player.offsetWidth;
                    xSpeed = 0;
                    Player.style.left = x + 'px';
                } else if (xSpeed < 0) {
                    x = rect.right;
                    xSpeed = 0;
                    Player.style.left = x + 'px';
                }
            }
        });

        blocks.forEach((block, index) => {
            let rect = block.getBoundingClientRect();
            let playerBottom = y + Player.offsetHeight;
            let playerLeft = x;
            let playerRight = x + Player.offsetWidth;
            //above colison
            if (
                playerBottom >= rect.top &&
                playerBottom <= rect.top + 10 &&
                playerRight > rect.left &&
                playerLeft < rect.right
            ) {
                if (ySpeed > 0) {
                    y = rect.top - Player.offsetHeight;
                    ySpeed = 0;
                    Player.style.top = y + 'px';
                    isOnGround = 2;
                    doubleJumpUsed = false; 
                }
                if (xSpeed>0){
                    xSpeed=xSpeed/1.043;
                }
                if(index===18){
                    if (h1) h1.innerText = 'YOU WONNNNN';
                }
            }
            //botton colison
    
            let playerTop = y;
            if (
                playerTop <= rect.bottom &&
                playerTop >= rect.bottom - 10 &&
                playerRight > rect.left &&
                playerLeft < rect.right
            ) {
                ySpeed = -ySpeed * 0.1; 
            }
            // Side collision 
            if (
                playerRight >= rect.left &&
                playerLeft <= rect.right &&
                y + Player.offsetHeight > rect.top &&
                y < rect.bottom
            ) {
                if (xSpeed > 0) {
                    x = rect.left - Player.offsetWidth;
                    xSpeed = 0;
                    Player.style.left = x + 'px';
                } else if (xSpeed < 0) {
                    x = rect.right;
                    xSpeed = 0;
                    Player.style.left = x + 'px';
                }
            }
        });

        // Coin collection logic
        let coinElements = document.querySelectorAll('.coin');
        coinElements.forEach((coin, idx) => {
            // Only check visible coins (not already collected)
            if (coin.style.visibility === "hidden") return;

            let coinRect = coin.getBoundingClientRect();
            let playerRect = Player.getBoundingClientRect();

            // Simple AABB collision detection
            if (
                playerRect.right > coinRect.left &&
                playerRect.left < coinRect.right &&
                playerRect.bottom > coinRect.top &&
                playerRect.top < coinRect.bottom
            ) {
                // Collect the coin
                coin.style.visibility = "hidden";
                coinCollected++;
                score += 1;
                const scoreDiv = document.getElementById('score');
                if (scoreDiv) {
                    scoreDiv.textContent = `Score: ${score}`;
                    if (score > Highscore) {
                        Highscore = score;
                        const highScoreDiv = document.getElementById("highScore");
                        if (highScoreDiv) {
                            highScoreDiv.textContent = `High Score : ${Highscore}`;
                            updateHighScore(score);
                        }
                    }
                }
                // e.g. document.getElementById('score').innerText = coinCollected;
            }
        });

    }

    function getLastBlockX() {
        const lastBlock = document.querySelectorAll('.block');
        if (lastBlock.length === 0) return 0; 
        const lastBlockRect = lastBlock[lastBlock.length - 1].getBoundingClientRect();
        return lastBlockRect.right + cameraX; 
    }


    function cameraMoving() {
        cameraX += cameraSpeed;
        
        game.style.transform = `translateX(${-cameraX}px)`;
    }

    function generateBlocks() {
        const lastBlockX = getLastBlockX();
        const spawnThreshold = window.innerWidth * 1.2; 
        
        if (cameraX + spawnThreshold > lastBlockX) {
            const block = document.createElement('div');
            block.className = 'block';
            block.style.width = `${Math.random() * 50 + 50}px`;
            block.style.height = `${Math.random() * 200 + 20}px`;
            const blockHolder = document.createElement('div');
            blockHolder.className = 'blockHolder';
            
            // Add a coin with a certain probability (e.g., 40%)
            if (Math.random() < 0.4) {
                const Coin = document.createElement('div');
                Coin.className = `coin`;
                blockHolder.appendChild(Coin);
            }
            blockHolder.appendChild(block);
            game.appendChild(blockHolder);
            blocks = document.querySelectorAll('.block');
        }
    }

    // function deleteBlocks() {
    //     blocks.forEach((block) => {
    //         const rect = block.getBoundingClientRect();
    //         if (rect.right < 0 || rect.left > window.innerWidth) {
    //             block.remove();
    //         }
    //     });
    // }

    function gameLoop(){
        cameraMoving();
        moving();
        generateBlocks();
        // deleteBlocks();
        requestAnimationFrame(gameLoop);
    }

    if (startButton) {
        startButton.addEventListener('click', () => {
            startButton.blur();
            if(startButton.innerText!="Reset"){
                console.log('Button clicked!'); 
                startButton.innerText="Reset";
                if (analyser) {
                    detectLoudness();
                }
                gameLoop();
            }
            if (startButton.innerText === "Reset") {
                Player.style.left = '60px';
                Player.style.top = '300px';
                cameraX = 0;
                game.style.transform = 'translateX(0px)';
                x = 60;
                y = 300;
                xSpeed = 0;
                ySpeed = 0;
                isOnGround = 0;
                doubleJumpUsed = false;
            }
        });
    } else {
        console.error('Start button not found!');
    }
});