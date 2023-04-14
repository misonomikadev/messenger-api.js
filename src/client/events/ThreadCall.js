const Thread = require('../../structures/Thread')
const Events = require('../../enums/Events')

module.exports = async function(client, event) {
    const thread = client.threads.cache.get(event.threadID)

    if (!thread) {
        const fetched = await client.api.getThreadInfo(event.threadID)
        const newThread = new Thread(client, fetched)

        client.threads.cache.set(event.threadID, newThread)
        
    } else {
        
    }
}