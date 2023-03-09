const { Client } = require('../')
const client = new Client({ online: true })

client.on('ready', bot => {
    global.client = bot
    console.log(`${bot.user.username} đã online`)
})

client.on('messageCreate', message => {
    if (message.isClientUser) return
    if (message.content === '/ping') {
        message.thread.send(`<@${message.author.id}>, ${Date.now() - message.createdTimestamp}ms is my ping :3`)
    }
})

const token = require('../credentials/token.json')
client.login(token)
