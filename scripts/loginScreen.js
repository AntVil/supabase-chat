let user;

async function signUp(e){
    e.preventDefault();

    let emailElement = e.srcElement[0];
    let passwordElement = e.srcElement[1];
    let passwordRepeatElement = e.srcElement[1];

    if(passwordElement.value !== passwordRepeatElement.value){
        passwordElement.classList.add("fieldInvalid");
        passwordRepeatElement.classList.add("fieldInvalid");
    }

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

    if(error === null || error === undefined || error === false){
        emailElement.classList.remove("fieldInvalid");
        passwordElement.classList.remove("fieldInvalid");
        emailElement.value = "";
        passwordElement.value = "";
        document.getElementById("verifyEmail").checked = true;
    }else{
        emailElement.classList.add("fieldInvalid");
        passwordElement.classList.add("fieldInvalid");
    }
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
        user = data.user;
        setupProfile();
        emailElement.value = "";
        passwordElement.value = "";
    }else{
        emailElement.classList.add("fieldInvalid");
        passwordElement.classList.add("fieldInvalid");
    }
}

async function setupProfile(){
    const { data, error } = await client.from("profiles").select().eq("user_id", user.id);

    if(data.length === 1){
        updateThemeLocally(data[0].theme);
        document.getElementById("username").innerText = data[0].name;
        setupChat();
    }else{
        document.getElementById("profileCreation").checked = true;
    }
}

async function createProfile(e){
    e.preventDefault();

    let usernameElement = e.srcElement[0];
    let username = usernameElement.value.trim();
    
    if(username.length === 0){
        usernameElement.classList.add("fieldInvalid");
        return;
    }else{
        await client.from("profiles").insert([{name: username}]);
        document.getElementById("username").innerText = username;
        setupChat();
        usernameElement.value = "";
        usernameElement.classList.remove("fieldInvalid");
    }
}
