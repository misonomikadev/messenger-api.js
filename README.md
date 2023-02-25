### <strong>Warning: I don't take any responsibility for blocked Facebook accounts that used this module.</strong>

## 1. About

- **messenger-api.js** is a powerful [Node.js](https://nodejs.org/) module that allow you to interact with the Facebook API.
- I edited [fca-duong](https://npmjs.com/package/fca-duong) package to make this, sorry :))).

## 2. Installation

```sh
npm install messenger-api.js@latest
```

## 3. Example usage

- Install [messenger-api.js](#2-installation):
- Login to your account:
- If you want to test this package, use [Facebook Whitehat Accounts](https://www.facebook.com/whitehat/accounts/).
```js
// index.js
const { Client, Events } = require("messenger-api.js")
const credentials = require("./path/to/your/fbstate.json")
const client = new Client({ online: true })

client.on(Events.Ready, bot => {
    console.log(`Logged as ${bot.user.username}`)
})

client.on(Events.MessageCreate, message => {
    if (message.isClientUser) return
    if (message.content === "/ping") {
        message.thread.send("Pong!")
    }
})

client.login(credentials)
```
```json
// fbstate.json
{
    // chinooooooooooo ><
}
```
- Note: Use [c3c-fbstate](https://github.com/c3cbot/c3c-fbstate) to get your account credentials.

## 4. Extensions
- [c3c-fbstate](https://github.com/c3cbot/c3c-fbstate) ([source](https://github.com/c3cbot/c3c-fbstate))

## 5. Contributing

## 6. Help
