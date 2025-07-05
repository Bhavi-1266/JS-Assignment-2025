let blocks=document.querySelectorAll(".block");

let startButton = document.querySelector(".startButton");

let Player = document.createElement("div");
Player.style.width = "0.6rem";
Player.style.height = "0.6rem";
Player.style.backgroundColor = "black";
Player.style.position = "absolute";
Player.style.left = "60px";
Player.style.top = "300px";

document.body.appendChild(Player);

let xSpeed = 0;
let Yspeed = 0;
let g = 0.05;

let Yacc = g;
let Xacc = 0;

let playerRect = Player.getBoundingClientRect();
let isOnGround = false;
let x = 60;
let y = 300;

let blockTops = [];

blocks.forEach(block => {
    let rect = block.getBoundingClientRect();
    blockTops.push(rect.top);
});

function falling() {
    Yspeed += Yacc;
    y += Yspeed;

    Player.style.top = y + 'px';

    if (y + Player.offsetHeight >= window.innerHeight) {
        y = window.innerHeight - Player.offsetHeight;
        Yspeed = 0;
        Player.style.top = y + 'px';
    }

    // Check collision with block tops
    blocks.forEach((block, index) => {
        let rect = block.getBoundingClientRect();
        let playerBottom = y + Player.offsetHeight;
        let playerLeft = x;
        let playerRight = x + Player.offsetWidth;
        
        // Check if player is above the block and within its horizontal bounds
        if (playerBottom >= rect.top && playerBottom <= rect.top + 10 && 
            playerRight > rect.left && playerLeft < rect.right) {
            if (Yspeed > 0) { // Only if falling
                y = rect.top - Player.offsetHeight;
                Yspeed = 0;
                Player.style.top = y + 'px';
                isOnGround = true;
            }
        }
    });
    

    requestAnimationFrame(falling);
}

falling();


startButton.addEventListener("click", () => {
    alert("VDFF ");

});
