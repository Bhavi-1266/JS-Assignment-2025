let inputButton = document.querySelector(".sendButton button");
let inputText=document.querySelector(".inputText input");
let ChatBox=document.querySelector(".chats");
let clear = document.querySelector("#clear");    
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

async function aiFetch(prompt, model, key) {
    let response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + key,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: model,
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],  
             stream: true,
        }),
    });

    let data = await response.json();
    if (!response.ok) {
        console.error('API Error:', data);
        throw new Error(data.error?.message || ` Failed to fetch AI response`);
    }
    return data.choices[0].message.content;
}

inputButton.addEventListener("click", () => {
    let apiKey = document.querySelector("#ApiKey").value;
    if(apiKey === ""){
        document.querySelector("#ApiKey").setAttribute("placeholder", "Please enter your API key");
        alert("API KEY NOT FOUND");
        return;
    }
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
        aiResponse.style.backgroundColor = "#145f68";
        let response = aiFetch(prompt, model, apiKey);
        response.then((data) => {
            aiResponse.textContent = data;
            aichat.text = data;
            
            chatHistory.push(aichat);
            localStorage.setItem(localStorageKey, JSON.stringify(chatHistory));
            
            inputText.value = "";
        }).catch((error) => {
            aiResponse.textContent = "Error:sorry";
            aichat.text = "Error: sorry";
            
            chatHistory.push(aichat);
            localStorage.setItem(localStorageKey, JSON.stringify(chatHistory));
            
            inputText.value = "";
        });
        aiResponse.innerText ="Thinking....";
        ChatBox.prepend(aiResponse);
    }
});

inputText.addEventListener("keypress", (e) => {
    if(e.key === "Enter") {
        inputButton.click();
    }
});


clear.addEventListener("click", () => {
    const chatElements = document.querySelectorAll('.chat');
    chatElements.forEach(element => element.remove());
    chatHistory = [];
    localStorage.setItem(localStorageKey, JSON.stringify([]));
});

