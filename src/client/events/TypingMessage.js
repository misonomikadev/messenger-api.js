const Events = require('../../enums/Events')
const Thread = require('../../structures/Thread')

module.exports = async function(client, event) {
    const thread = client.threads.cache.get(event.threadID)
        ?? await client.api.getThreadInfo(event.threadID)
            .then(th => {
                const newThread = new Thread(client, th)
                client.threads.cache.set(event.threadID, newThread)
                return newThread
            })

    const member = thread.members.cache.get(event.from)
    client.emit(Events.MessageTyping, member, event.isTyping)
}