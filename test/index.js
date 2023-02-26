const { Client } = require('../')
const client = new Client({ online: true })

client.on('ready', bot => {
    global.client = bot
    console.log(`${bot.user.username} đã online`)
})

client.on('messageCreate', message => {
    if (message.isClientUser) return
    if (message.content === '/ping') {
        message.thread.send({ content: `Pong <@${message.author.id}> :3` })
        .catch(console.error)
    }
})

const token = require('../credentials/token.json')
client.login(token)