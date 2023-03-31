const { Client } = require('../')
const client = new Client({ online: true })

client.on('ready', bot => {
    global.client = bot
    console.log(`${bot.user.username} đã online`)
})

client.on('messageCreate', message => {
    if (message.isClientUser) return
    message.reply(message.content, { typing: true })
})

const token = require('../credentials/token.json')
client.login(token)
