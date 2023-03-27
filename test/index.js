const { Client } = require('../')
const client = new Client({ online: true })

client.on('ready', bot => {
    global.client = bot
    console.log(`${bot.user.username} đã online`)
})

client.on('messageCreate', message => {
    if (message.isClientUser) return
    if (message.content === '/invite') {
        message.thread.send(message.thread.invite.url)
    }
})

const token = require('../credentials/token.json')
client.login(token)
