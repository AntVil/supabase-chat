async function signUp(e){
    e.preventDefault();

    let usernameElement = e.srcElement[0];
    let emailElement = e.srcElement[1];
    let passwordElement = e.srcElement[2];

    let data;
    let error;
    try{
        ({data, error} = await client.auth.signUp({
            email: emailElement.value, 
            password: passwordElement.value
        }));
    }catch{
        error = true;
    }
    user = data.user;

    if(error === null || error === undefined || error === false){
        emailElement.classList.remove("fieldInvalid");
        passwordElement.classList.remove("fieldInvalid");
        emailElement.value = "";
        passwordElement.value = "";
        user = data.user;
        setupChat();
        document.getElementById("chatScreen").checked = true;
    }else{
        emailElement.classList.add("fieldInvalid");
        passwordElement.classList.add("fieldInvalid");
    }

    document.getElementById("chatScreen").checked = true;
}

async function signIn(e){
    e.preventDefault();

    let emailElement = e.srcElement[0];
    let passwordElement = e.srcElement[1];

    let data;
    let error;
    try{
        ({data, error} = await client.auth.signInWithPassword({
            email: emailElement.value, 
            password: passwordElement.value
        }));
    }catch{
        error = true;
    }
    
    if(error === null || error === undefined || error === false){
        emailElement.classList.remove("fieldInvalid");
        passwordElement.classList.remove("fieldInvalid");
        emailElement.value = "";
        passwordElement.value = "";
        user = data.user;
        setupChat();
        document.getElementById("chatScreen").checked = true;
    }else{
        emailElement.classList.add("fieldInvalid");
        passwordElement.classList.add("fieldInvalid");
    }
}

async function signOut(){
    await client.auth.signOut();
    user = undefined;
}
