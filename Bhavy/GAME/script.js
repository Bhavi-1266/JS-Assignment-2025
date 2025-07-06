let blocks=document.querySelectorAll(".block");

let startingText =document.querySelector("h1");

let startButton = document.querySelector(".startButton");

let Player = document.createElement("div");
Player.style.width = "0.6rem";
Player.style.height = "0.6rem";
Player.style.backgroundColor = "orange";
Player.style.position = "absolute";
Player.style.left = "60px";
Player.style.top = "300px";

document.body.appendChild(Player);

let xSpeed = 0;
let ySpeed = 0;
let g = 0.05;

let Yacc = g;
let Xacc = -0.007;

let playerRect = Player.getBoundingClientRect();
let isOnGround = 0;
let x = 60;
let y = 300;


//blocks 




//jumpp
const jump = (key) => {
    if(isOnGround > 0){
        ySpeed = -2;
        xSpeed=1;
        isOnGround--;
    }   
}
document.addEventListener('keydown', (key) => {
    if (key.code === "Space" && !key.repeat) {
        jump(key);
    }
});


//main physic and aniimation
function moving() {
    
        ySpeed += Yacc;
        y += ySpeed;
        
        if(!(xSpeed >-0.2 && xSpeed<0.1)){
            xSpeed+= Xacc;
            x+=xSpeed;
            Player.style.left = x + 'px';
        }

        Player.style.top = y + 'px';
        

        if (y + Player.offsetHeight >= window.innerHeight) {
            y = window.innerHeight - Player.offsetHeight;
            ySpeed = 0;
            Player.style.top = y + 'px';
            startingText.innerText="HAHAHA YOU LOOSE";
        }

        // if (x + Player.offsetLeft >= window.innerWidth) {
        //     x = window.innerWidth - Player.offsetLeft;
        //     xSpeed = 0;
        //     Player.style.left = x + 'px';
        // }


        // if block is on block
        blocks.forEach((block, index) => {
            let rect = block.getBoundingClientRect();
            let playerBottom = y + Player.offsetHeight;
            let playerLeft = x;
            let playerRight = x + Player.offsetWidth;
            
            if (playerBottom >= rect.top && playerBottom <= rect.top + 10 && 
                playerRight > rect.left && playerLeft < rect.right) {
                if (ySpeed > 0) { // Only if falling
                    y = rect.top - Player.offsetHeight;
                    ySpeed = 0;
                    Player.style.top = y + 'px';
                    isOnGround = 2;
                }
            }
            // Side collision detection
            if (playerRight >= rect.left && playerLeft <= rect.right &&
                y + Player.offsetHeight > rect.top && y < rect.bottom) {
                if (xSpeed > 0) { // Moving right
                    x = rect.left - Player.offsetWidth;
                    xSpeed = 0;
                    Player.style.left = x + 'px';
                } else if (xSpeed < 0) { // Moving left
                    x = rect.right;
                    xSpeed = 0;
                    Player.style.left = x + 'px';
                }
            }
        });
    

    requestAnimationFrame(moving);
}



// Add click event listener to start button
startButton.addEventListener("click", () => {
    alert("VDFF ");
    moving();
});
