const Events = require('../../enums/Events')
const Thread = require('../../structures/Thread')

module.exports = function(client, event) {
    const thread = client.threads.cache.get(event.threadID)

    if (!thread) {
        const fetchThread = client.api.getThreadInfo(event.threadID)
        const newThread = new Thread(client, fetchThread)
        const actionMember = newThread.members.cache.get(event.author)

        client.threads.cache.set(event.threadID, newThread)
        client.emit(Events.ThreadRename, newThread, actionMember)
    } else {
        const actionMember = thread.members.cache.get(event.author)
        thread.name = event.logMessageData.name
        
        client.emit(Events.ThreadRename, thread, actionMember)
    }
}