const Events = require('../../enums/Events')
const Thread = require('../../structures/Thread')

module.exports = async function(client, event) {
    const thread = client.threads.cache.get(event.threadID)

    const data = {
        updatedTimestamp: Number(event.timestamp),
        attachmentID: event.image.attachmentID,
        width: event.image.width,
        height: event.image.height,
        url: event.image.url
    }

    Object.assign(data, { updatedAt: new Date(data.updatedTimestamp) })
    if (!thread) {
        const fetched = await client.api.getThreadInfo(event.threadID)
        const newThread = new Thread(client, fetched)
        const authorMember = newThread.members.cache.get(event.author)

        client.threads.cache.set(event.threadID, newThread)
        client.emit(Events.ThreadImageUpdate, newThread, data, authorMember)
    } else {
        const authorMember = thread.members.cache.get(event.author)
        this.iconUrl = data.url
        
        client.emit(Events.ThreadImageUpdate, thread, data, authorMember)
    }
}