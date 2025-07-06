let val = "x";
let button = document.querySelectorAll("button");

const winner = () => {
     
    for(let i = 0; i < 9; i += 3){
        if(button[i].innerText === button[i+1].innerText && 
           button[i+1].innerText === button[i+2].innerText && 
           button[i].innerText !== ""){
            return button[i].innerText;
        }
    }
    
     
    for(let i = 0; i < 3; i++){
        if(button[i].innerText === button[i+3].innerText && 
           button[i+3].innerText === button[i+6].innerText && 
           button[i].innerText !== ""){
            return button[i].innerText;
        }
    }
    
     
    if(button[0].innerText === button[4].innerText && 
       button[4].innerText === button[8].innerText && 
       button[0].innerText !== ""){
        return button[0].innerText;
    }
    
    if(button[2].innerText === button[4].innerText && 
       button[4].innerText === button[6].innerText && 
       button[2].innerText !== ""){
        return button[2].innerText;
    }
    
    return null;  
}


button.forEach( (btn) => {
    btn.addEventListener('click' , () => {
        if(btn.innerText===""){
            btn.innerText=val;
            if(val==="x"){
                val="o";
            }else{
                val="x";
            }
            let winnerPlayer=winner();
            if(winnerPlayer){
                let status = document.querySelector(".state");
                status.innerText=`${winnerPlayer} has won `;
            }
        }
    })
})