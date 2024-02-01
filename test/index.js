const { Client } = require('../')
const client = new Client({ online: true })

client.on('ready', bot => {
    console.log(`${bot.user.username} đã online`)
    global.client = bot
})

const token = require('./config/cookies.json')
client.login(token)
