const Events = require('../../enums/Events')

module.exports = async function(client, event) {
    const thread = client.threads.cache.get(event.threadID)
        ?? await client.api.getThreadInfo(event.threadID)
            .then(th => {
                const newThread = new Thread(client, th)
                client.threads.cache.set(event.threadID, newThread)
                return newThread
            })
            
    const data = {
        thread: thread,
        reader: thread.members.cache.get(event.reader),
        readedTimestamp: Number(event.time),
    }

    Object.assign(data, { readedAt: new Date(data.readedTimestamp) })
    client.emit(Events.UserRead, data)
}