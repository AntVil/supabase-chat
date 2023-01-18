let chatElement;

async function setupChat(){
    subscribe();

    chatElement = document.getElementById("chat");

    getMessages();
}

async function getMessages(){
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

    chatElement.scrollTop = chatElement.scrollHeight
}

async function sendMessage(e){
    e.preventDefault();
    
    let messageElement = e.srcElement[0];
    
    const { data, error } = await client.from("messages").insert([{
        user_id: user.id,
        content: messageElement.value
    }]);

    messageElement.value = "";

    console.log(data, error);
}

async function subscribe(){
    client.channel("public:messages").on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
        let message = payload.new.content;
        let date = new Date(payload.new.created_at);
        let user_id = payload.new.user_id;

        chatElement.appendChild(
            getMessageElement(message, user_id, date)
        );
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
    .replaceAll(/\*\*([^*]+)\*\*/ig, "<b>$1</b>") // normal tags
    .replaceAll(/\*([^*]+)\*/ig, "<i>$1</i>")
    .replaceAll(/~([^~]+)~/ig, "<del>$1</del>")
    .replaceAll(/`([^`]+)`/ig, "<code>$1</code>");

    messageElement.appendChild(messageContent);
    messageElement.appendChild(messageTime);

    return messageElement;
}
