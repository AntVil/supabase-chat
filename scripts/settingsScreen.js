async function initializeChangeUsername(){
    let usernameInput = document.querySelector("#changeUsername+form>input");
    usernameInput.value = document.getElementById("username").innerText;
}

async function updateUsername(e){
    e.preventDefault();

    let usernameElement = e.srcElement[0];
    let username = usernameElement.value.trim();
    
    if(username.length === 0){
        usernameElement.classList.add("fieldInvalid");
        return;
    }else{
        document.getElementById("username").innerText = username;
        document.getElementById("settingsHub").checked = true;
        usernameElement.value = "";
        usernameElement.classList.remove("fieldInvalid");
        await client.from("profiles").update([{name: username}]).eq("user_id", user.id);
    }
}

async function updateThemeLocally(theme){
    let apperanceInput = document.querySelector("#changeTheme+form>select");
    apperanceInput.value = theme;

    if(theme === "system" || theme === undefined || theme === null || theme === ""){
        document.documentElement.style.setProperty('--theme-color-0', "");
        document.documentElement.style.setProperty('--theme-color-1', "");
        document.documentElement.style.setProperty('--theme-color-2', "");
        document.documentElement.style.setProperty('--theme-color-3', "");
        document.documentElement.style.setProperty('--font-color', "");
    }else{
        document.documentElement.style.setProperty('--theme-color-0', `var(--${theme}-theme-color-0)`);
        document.documentElement.style.setProperty('--theme-color-1', `var(--${theme}-theme-color-1)`);
        document.documentElement.style.setProperty('--theme-color-2', `var(--${theme}-theme-color-2)`);
        document.documentElement.style.setProperty('--theme-color-3', `var(--${theme}-theme-color-3)`);
        document.documentElement.style.setProperty('--font-color', `var(--${theme}-font-color)`);
    }
    
    document.getElementsByName("theme-color")[0].content = getComputedStyle(document.body).getPropertyValue("--theme-color-1")
}

async function updateTheme(e){
    e.preventDefault();

    let themeElement = e.srcElement[0];
    let theme = themeElement.value;
    
    document.getElementById("settingsHub").checked = true;

    await client.from("profiles").update([{theme: theme}]).eq("user_id", user.id);
}

async function signOut(){
    document.getElementById("username").innerText = "Username";
    clearChat();
    client.auth.signOut();
    user = undefined;
}

async function deleteAccount(){
    document.getElementById("signIn").checked = true;
    await client.rpc("delete_user_serverrpc");
}
