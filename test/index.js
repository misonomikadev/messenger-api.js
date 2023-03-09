const { Client } = require('../')
const client = new Client({ online: true })

client.on('ready', bot => {
    global.client = bot
    console.log(`${bot.user.username} đã online`)
})

client.on('threadPollCreate', console.log)
client.on('threadPollUpdate', console.log)

const token = require('../credentials/token.json')
client.login(token)