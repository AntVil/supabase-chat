let client;
let user;

window.onload = async () => {
    document.getElementsByName("theme-color")[0].content = getComputedStyle(document.body).getPropertyValue("--theme-color-1")

    window.addEventListener("keydown", e => {
        if(e.target.tagName === "LABEL" && e.key === "Enter"){
            if(e.repeat){
                return;
            }

            e.target.click();
        }
        if(e.key === "Escape"){
            document.activeElement.blur();
        }
    });

    window.addEventListener("touchstart", e => {
        if(document.activeElement !== e.target){
            document.activeElement.blur();
        }
    })

    client = supabase.createClient(
        "https://gsvmszdzslhmpnixllkx.supabase.co",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdzdm1zemR6c2xobXBuaXhsbGt4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM4NjcxODcsImV4cCI6MTk4OTQ0MzE4N30.JQ5xk2OtGLiDt0BG76X2k4421iY5x2Xsa8b7TqylDfE"
    );
}

async function createProfile(){
    const { data, error } = await client.from("profiles").insert([{
        user_id: user.id,
        name: "authenticated user"
    }]);
    console.log(data, error);
}

async function updateProfile(){
    const { data, error } = await client.from("profiles").update([{
        user_id: user.id,
        name: "updated user"
    }]).eq("user_id", user.id);
    console.log(data, error);
}

async function getProfiles(){
    const { data, error } = await client.from("profiles").select()
    console.log(data, error);
}

async function getOwnProfile(){
    const { data, error } = await client.from("profiles").select().eq("user_id", user.id);
    console.log(data, error);
}
