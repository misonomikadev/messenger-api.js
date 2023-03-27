### <strong>Warning: I don't take any responsibility for blocked Facebook accounts that used this module.</strong>

## 1. About

- **messenger-api.js** is a powerful [Node.js](https://nodejs.org/) module that allow you to interact with the Facebook API.

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

    if (message.content === "/mention") {
        message.thread.send(`<@${message.author.id}> :3`)
    }
})

client.login(credentials)
```
```json
// fbstate.json
[
    {
        "key": "dbln",
        "value": "%7B%22000000000000000%22%3A%22HHEKSDDOR78%22%7D",
        "domain": "facebook.com",
        "path": "/login/device-based/",
        "hostOnly": false,
        "creation": "2023-02-25T15:46:50.557Z",
        "lastAccessed": "2023-02-25T15:46:50.558Z"
    },
    {
        "key": "sb",
        "value": "AeR-RES-qr98de480ogajq79g",
        "domain": "facebook.com",
        "path": "/",
        "hostOnly": false,
        "creation": "2023-02-25T15:46:50.558Z",
        "lastAccessed": "2023-02-25T15:46:50.558Z"
    },
    {
        "key": "datr",
        "value": "AeR-GfqGyAF-otw480ogajq79g",
        "domain": "facebook.com",
        "path": "/",
        "hostOnly": false,
        "creation": "2023-02-25T15:46:50.558Z",
        "lastAccessed": "2023-02-25T15:46:50.558Z"
    },
    {
        "key": "locale",
        "value": "en_GB",
        "domain": "facebook.com",
        "path": "/",
        "hostOnly": false,
        "creation": "2023-02-25T15:46:50.558Z",
        "lastAccessed": "2023-02-25T15:46:50.558Z"
    },
    {
        "key": "wd",
        "value": "1322x623",
        "domain": "facebook.com",
        "path": "/",
        "hostOnly": false,
        "creation": "2023-02-25T15:46:50.558Z",
        "lastAccessed": "2023-02-25T15:46:50.558Z"
    },
    {
        "key": "c_user",
        "value": "000000000000000",
        "domain": "facebook.com",
        "path": "/",
        "hostOnly": false,
        "creation": "2023-02-25T15:46:50.558Z",
        "lastAccessed": "2023-02-25T15:46:50.558Z"
    },
    {
        "key": "presence",
        "value": "C%7B%22lm3%22%3A%22g.2807234593920434%22%2C%22t3%22%3A%5B%5D%2C%22utc3%22%3A7855167733735%2C%22v%22%3A1%7D",
        "domain": "facebook.com",
        "path": "/",
        "hostOnly": false,
        "creation": "2023-02-25T15:46:50.558Z",
        "lastAccessed": "2023-02-25T15:46:50.558Z"
    },
    {
        "key": "xs",
        "value": "secret",
        "domain": "facebook.com",
        "path": "/",
        "hostOnly": false,
        "creation": "2023-02-25T15:46:50.558Z",
        "lastAccessed": "2023-02-25T15:46:50.558Z"
    },
    {
        "key": "fr",
        "value": "secret",
        "domain": "facebook.com",
        "path": "/",
        "hostOnly": false,
        "creation": "2023-02-25T15:46:50.558Z",
        "lastAccessed": "2023-02-25T15:46:50.558Z"
    }
]
```
- Note: Use [c3c-fbstate](https://github.com/c3cbot/c3c-fbstate) to get your account credentials.

## 4. Extensions
- [c3c-fbstate](https://github.com/c3cbot/c3c-fbstate) ([source](https://github.com/c3cbot/c3c-fbstate))

## 5. Contributing

## 6. Help
