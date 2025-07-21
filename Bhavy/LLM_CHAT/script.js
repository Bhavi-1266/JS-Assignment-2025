let inputButton = document.querySelector(".sendButton button");
let inputText=document.querySelector(".inputText input");
let ChatBox=document.querySelector(".chats");
let clear = document.querySelector("#clear");    
let localStorageKey = "chatHistory";
let chatHistory = JSON.parse(localStorage.getItem(localStorageKey) || "[]");


function formatMarkdown(text) {
    text = text.replace(/\n/g, '<br>'); 

    text = text.replace(/```(\w*)\n([\s\S]*?)\n```/g, 
        '<pre class="code-block"><code class="$1">$2</code></pre>');

    text = text.replace(/`([^`]+?)`/g, '<code class="inline-code">$1</code>');

    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    text = text.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');

    text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');

    text = text.replace(/^(\d+\.|-)\s(.*$)/gm, '<li>$2</li>');
    text = text.replace(/^(<li>.*<\/li>)+/gm, '<ul>$&</ul>');

    text = text.replace(/^>\s(.*$)/gm, '<blockquote>$1</blockquote>');

    text = text.replace(/^(\*\*\*|---)$/gm, '<hr>');

    text = text.replace(/(<br>\s*){2,}/g, '</p><p>');
    text = '<p>' + text + '</p>'; 

    return text;
}


if (chatHistory.length > 0) {
    chatHistory.forEach(chat => {
        let chatObj = document.createElement("div");
        chatObj.classList.add("chat", chat.origin === "user" ? "Me" : "AI");
        chatObj.style.justifyContent = chat.origin === "user" ? "flex-end" : "flex-start";
        chatObj.innerHTML = chat.text;
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

// Helper function to stream text
async function streamText(element, text, delay = 30) {
    element.innerHTML = "";
    let i = 0;
    while (i < text.length) {
        // Add next character (or word, if you want word-by-word)
        element.innerHTML += text[i];
        i++;
        await new Promise(res => setTimeout(res, delay));
    }
}

async function aiFetch(prompt, model, key) {
    let aichat = new ChatMessage("ai", "", model);
    let aiResponse = document.createElement("div");
    aiResponse.classList.add("chat", "AI");
    aiResponse.style.backgroundColor = "#145f68";
    aiResponse.innerHTML = "Thinking . .. ...";
    ChatBox.prepend(aiResponse);

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
            stream: true
        })
    });

    if (!response.ok) {
        aiResponse.innerHTML = "API Error";
        return;
    }

    // Streaming logic
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let buffer = "";
    let fullMessage = "";

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let lines = buffer.split('\n');
        buffer = lines.pop(); 

        for (let line of lines) {
            line = line.trim();
            if (line.startsWith("data:")) {
                let data = line.replace("data:", "").trim();
                if (data === "[DONE]") continue;
                try {
                    let parsed = JSON.parse(data);
                    let delta = parsed.choices?.[0]?.delta?.content || "";
                    if (delta) {
                        fullMessage += delta;
                        aiResponse.innerHTML = formatMarkdown(fullMessage);
                    }
                } catch (e) {
                    
                }
            }
        }
    }

    // Save to history
    aichat.text = formatMarkdown(fullMessage);
    chatHistory.push(aichat);
    localStorage.setItem(localStorageKey, JSON.stringify(chatHistory));
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
        chatObj.classList.add("chat","Me");
        chatObj.style.justifyContent = "flex-end";
        chatObj.textContent = prompt;
        
        ChatBox.prepend(chatObj);
        
        chatHistory.push(newChat);
        localStorage.setItem(localStorageKey, JSON.stringify(chatHistory));

        //ai work
        

        aiFetch(prompt, model, apiKey);
        inputText.value="";

        
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

