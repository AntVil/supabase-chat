let profilesDict;
let chatElement;
let socket;
let shouldScrollDown = false;

async function setupChat(){
    chatElement = document.getElementById("chat");
    chatElement.onscroll = (e) => {
        shouldScrollDown = Math.abs((chatElement.scrollTop + chatElement.getBoundingClientRect().height) - chatElement.scrollHeight) < 10;
    }

    profilesDict = {};

    setupChatSocket();
    setupProfileSocket();
    setupChatHistory();

    document.getElementById("chatScreen").checked = true;
}

async function getUser(userId){
    if(userId in profilesDict){
        return profilesDict[userId];
    }

    const { data, error } = await client.from("profiles").select().eq("user_id", userId);

    if(data.length === 1){
        profilesDict[userId] = data[0].name;
    }else{
        profilesDict[userId] = "unknown user";
    }

    return profilesDict[userId];
}

async function setupChatHistory(){
    const { data, error } = await client.from("messages").select().order("created_at", { ascending: false });
    
    for(let payload of data){
        let message = payload.content;
        let date = new Date(payload.created_at);
        let user_id = payload.user_id;

        chatElement.insertBefore(
            await getMessageElement(message, user_id, date),
            chatElement.firstChild
        )
    }

    scrollChatDown();
}

async function sendMessage(e){
    e.preventDefault();
    
    let messageElement = e.srcElement[0];

    if(messageElement.value.trim().length === 0){
        return;
    }
    
    await client.from("messages").insert([{
        content: messageElement.value
    }]);

    messageElement.value = "";
}

async function setupChatSocket(){
    client.channel("public:messages").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, async (payload) => {
        let message = payload.new.content;
        let date = new Date(payload.new.created_at);
        let user_id = payload.new.user_id;

        chatElement.appendChild(
            await getMessageElement(message, user_id, date)
        );

        if(shouldScrollDown){
            scrollChatDown();
        }
    }).subscribe()
}

async function setupProfileSocket(){
    client.channel("public:profiles").on("postgres_changes", { event: "UPDATE", schema: "public", table: "messages" }, async (payload) => {
        let name = payload.new.name;
        let userId = payload.new.user_id;

        profiles[userId] = name;
        for(let messageElement of document.querySelectorAll("[data-user_id]")){
            messageElement.firstChild.innerText = name;
        }
    }).subscribe()
}

async function getMessageElement(message, user_id, date){
    let messageElement = document.createElement("section");
    messageElement.setAttribute("data-user_id", user_id);
    
    if(user_id === user.id){
        messageElement.classList.add("ownMessage");
    }

    let messageAuthor = document.createElement("p");
    messageAuthor.innerText = await getUser(user_id);

    let messageContent = document.createElement("p");
    messageContent.innerHTML = message
    .replaceAll(/&/ig, "&amp;") // clean up
    .replaceAll(/</ig, "&lt;")
    .replaceAll(/>/ig, "&gt;")
    .replaceAll(/\*\*([^ ][^*\n`]*)\*\*/ig, " <b>$1</b> ") // normal tags
    .replaceAll(/\*([^ ][^*]*)\*/ig, " <i>$1</i> ")
    .replaceAll(/~([^ ][^~\n]*)~/ig, " <del>$1</del> ")
    .replaceAll(/`([^ ][^`\n]*)`/ig, " <code>$1</code> ");

    let messageTime = document.createElement("time");
    messageTime.innerText = date.toLocaleTimeString();

    messageElement.appendChild(messageAuthor);
    messageElement.appendChild(messageContent);
    messageElement.appendChild(messageTime);

    return messageElement;
}

function clearChat(){
    client.removeAllChannels();
    chatElement.innerHTML = "";
    profiles = {};
}

function scrollChatDown(){
    chatElement.scrollTop = chatElement.scrollHeight;
    shouldScrollDown = true;
}
