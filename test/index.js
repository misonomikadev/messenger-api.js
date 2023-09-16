const { Client } = require('../')
const client = new Client({ online: true })

client.on('ready', bot => {
    global.client = bot
    console.log(`${bot.user.username} đã online`)
})

const token = require('./config/cookies.json')
client.login(token)
