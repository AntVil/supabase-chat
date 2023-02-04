# supabase-chat

[https://antvil.github.io/supabase-chat](https://antvil.github.io/supabase-chat)

### Setup
Install the dependencies (`express` & `cypress`)
```
npm install
```

### Run
Run the webserver
```
node index.js
```

### Test
While running the webserver run the following command in another terminal
```
npx cypress open --config watchForFileChanges=false
```
Navigate to `E2E Testing`
Choose a browser to test in
Choose an E2E spec to run
Under `./cypress/e2e` you can find the diffrent specs

### TODO
- [x] add account deletion
- [x] test account deletion
- [x] test login fail
- [ ] fix login navigation test
- [ ] test logout
- [ ] test change username
- [ ] test account creation fail
- [ ] test message sendable
- [ ] test empty message not sendable
- [ ] test chat message username & time
- [ ] test chat message both perspectives
