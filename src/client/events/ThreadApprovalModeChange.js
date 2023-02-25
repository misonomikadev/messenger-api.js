const Events = require('../../enums/Events')
const Thread = require('../../structures/Thread')

module.exports = async function(client, event) {
    const thread = client.threads.cache.get(event.threadID)

    if (!thread) {
        const fetchThread = await client.api.getThreadInfo(event.threadID)
        const newThread = new Thread(client, fetchThread)
        const authorAction = newThread.members.cache.get(event.author)

        client.threads.cache.set(event.threadID, newThread)
        switch(event.logMessageData.APPROVAL_MODE) {
            case'1':
                client.emit(Events.ThreadApprovalModeOn, newThread, authorAction)
                break
            case'0':
                client.emit(Events.ThreadApprovalModeOff, newThread, authorAction)
                break
            default: console.warn(event)
        }
    } else {
        const authorAction = thread.members.cache.get(event.author)
        switch(event.logMessageData.APPROVAL_MODE) {
            case'1':
                thread.requireApproval = true
                client.emit(Events.ThreadApprovalModeOn, thread, authorAction)
                break
            case'0':
                thread.requireApproval = false
                client.emit(Events.ThreadApprovalModeOff, thread, authorAction)
                break
            default: console.warn(event)
        }
    }
}