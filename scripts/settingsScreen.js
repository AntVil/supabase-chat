async function updateProfile(){
    const { data, error } = await client.from("profiles").update([{
        user_id: user.id,
        name: "updated user"
    }]).eq("user_id", user.id);
    console.log(data, error);
}
