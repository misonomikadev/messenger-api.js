const { Client, Events } = require("../")
// const credentials = require("./path/to/your/fbstate.json")
const client = new Client({ online: true })

client.on(Events.Ready, bot => {
    console.log(`Logged as ${bot.user.username}`)
})

client.on(Events.MessageCreate, message => {
    
})

client.login(credentials)