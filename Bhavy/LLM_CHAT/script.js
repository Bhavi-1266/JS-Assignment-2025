let inputButton = document.querySelector(".sendButton button");
let inputText=document.querySelector(".inputText input");
let ChatBox=document.querySelector(".chats");
    
let localStorageKey = "chatHistory";
let chatHistory = JSON.parse(localStorage.getItem(localStorageKey) || "[]");

if (chatHistory.length > 0) {
    chatHistory.forEach(chat => {
        let chatObj = document.createElement("div");
        chatObj.setAttribute("class", "chat");
        chatObj.style.justifyContent = chat.origin === "user" ? "flex-end" : "flex-start";
        chatObj.textContent = chat.text;
        ChatBox.prepend(chatObj);
    });
}

let model;  //defult
class ChatMessage {     
    constructor(origin, text, model) {
        this.origin = origin;
        this.text = text;
        this.model = model;
    }
}

async function aiFetch(prompt, model) {
    // let response = await fetch();

    // let finalResponse = await response.json();
    // return finalResponse;
    return ;
}

inputButton.addEventListener("click", () => {
    if(inputText.value === ""){
        inputText.setAttribute("placeholder", "Please enter a message");
        return;
    } else {
        model = document.querySelector(".modelSelector select").value;
        let prompt = inputText.value;
        let newChat = new ChatMessage("user", prompt, model);

        let chatObj = document.createElement("div");
        chatObj.setAttribute("class", "chat");
        chatObj.style.justifyContent = "flex-end";
        chatObj.textContent = prompt;
        
        ChatBox.prepend(chatObj);
        
        chatHistory.push(newChat);
        localStorage.setItem(localStorageKey, JSON.stringify(chatHistory));

        //ai work
        let aichat = new ChatMessage("ai", "", model);
        let aiResponse = document.createElement("div");
        aiResponse.setAttribute("class", "chat");
        aiResponse.style.justifyContent = "flex-start";
        let response = aiFetch(prompt, model);
        response.then((data) => {
            aiResponse.textContent = data;
            aichat.text = data;
            
            chatHistory.push(aichat);
            localStorage.setItem(localStorageKey, JSON.stringify(chatHistory));
            
            inputText.value = "";
        }).catch((error) => {
            aiResponse.textContent = "Error: " + error.message;
            aichat.text = "Error: " + error.message;
            
            chatHistory.push(aichat);
            localStorage.setItem(localStorageKey, JSON.stringify(chatHistory));
            
            inputText.value = "";
        });
        ChatBox.prepend(aiResponse);
    }
});

inputText.addEventListener("keypress", (e) => {
    if(e.key === "Enter") {
        inputButton.click();
    }
});