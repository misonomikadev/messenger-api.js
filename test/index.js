const { Client } = require('../')
const client = new Client({ online: true })

client.on('ready', bot => {
    console.log(`${bot.user.username} đã online`)
})

client.on('messageCreate', message => {
    message.attachments
})