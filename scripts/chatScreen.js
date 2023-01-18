let profiles;
let chatElement;
let socket;
let shouldScrollDown = false;

async function setupChat(){
    chatElement = document.getElementById("chat");
    chatElement.onscroll = (e) => {
        shouldScrollDown = Math.abs((chatElement.scrollTop + chatElement.getBoundingClientRect().height) - chatElement.scrollHeight) < 10;
    }

    setupChatSocket();
    setupChatHistory();

    document.getElementById("chatScreen").checked = true;
}

async function setupChatHistory(){
    const { data, error } = await client.from("messages").select().order("created_at", { ascending: false });
    
    for(let payload of data){
        let message = payload.content;
        let date = new Date(payload.created_at);
        let user_id = payload.user_id;

        chatElement.insertBefore(
            getMessageElement(message, user_id, date),
            chatElement.firstChild
        )
    }

    scrollChatDown();
}

async function sendMessage(e){
    e.preventDefault();
    
    let messageElement = e.srcElement[0];
    
    await client.from("messages").insert([{
        content: messageElement.value
    }]);

    messageElement.value = "";
}

async function setupChatSocket(){
    client.channel("public:messages").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
        let message = payload.new.content;
        let date = new Date(payload.new.created_at);
        let user_id = payload.new.user_id;

        chatElement.appendChild(
            getMessageElement(message, user_id, date)
        );

        if(shouldScrollDown){
            scrollChatDown();
        }
    }).subscribe()
}

function getMessageElement(message, user_id, date){
    let messageElement = document.createElement("section");
    
    if(user_id === user.id){
        messageElement.classList.add("ownMessage");
    }

    let messageTime = document.createElement("time");
    messageTime.innerText = date.toLocaleTimeString();

    let messageContent = document.createElement("p");
    messageContent.innerHTML = message
    .replaceAll(/&/ig, "&amp;") // clean up
    .replaceAll(/</ig, "&lt;")
    .replaceAll(/>/ig, "&gt;")
    .replaceAll(/ \*\*([^*\n]+)\*\* /ig, " <b>$1</b> ") // normal tags
    .replaceAll(/ \*([^*\n]+)\* /ig, " <i>$1</i> ")
    .replaceAll(/ ~([^~\n]+)~ /ig, " <del>$1</del> ")
    .replaceAll(/ `([^`\n]+)` /ig, " <code>$1</code> ");

    messageElement.appendChild(messageContent);
    messageElement.appendChild(messageTime);

    return messageElement;
}

function clearChat(){
    client.removeAllChannels();
    chatElement.innerHTML = "";
    console.log(chatElement)
}

function scrollChatDown(){
    chatElement.scrollTop = chatElement.scrollHeight;
    shouldScrollDown = true;
}
