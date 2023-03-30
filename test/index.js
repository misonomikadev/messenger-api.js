const { Client } = require('../')
const client = new Client({ online: true })

client.on('ready', bot => {
    global.client = bot
    console.log(`${bot.user.username} đã online`)
})

client.on('messageCreate', message => console.log(message))

const token = require('../credentials/token.json')
client.login(token)
