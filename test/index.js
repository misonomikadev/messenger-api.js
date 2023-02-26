const { Client } = require('../src/index.js')
const client = new Client({ online: true })
const a = require('./a.json')
client.on('ready', bot => {
    console.log(`${bot.user.username} đã online`)
})

client.on('messageCreate', message => {
    if (message.content == 'ping') {
        message.reply('pong')
    }
})

client.login(a)