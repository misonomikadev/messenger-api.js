const Events = require('../../enums/Events')
const Thread = require('../../structures/Thread')

module.exports = async function(client, event) {
    const thread = client.threads.cache.get(event.threadID)

    if (!thread) {
        const fetchThread = await client.api.getThreadInfo(event.threadID)
        const newThread = new Thread(client, fetchThread)
        const authorAction = newThread.members.cache.get(event.author)

        client.threads.cache.set(event.threadID, newThread)
        switch(event.logMessageData.ADMIN_EVENT) {
            case'add_admin':
                const addMember = newThread.members.cache.get(event.logMessageData.TARGET_ID)
                client.emit(Events.ThreadAdminAdd, addMember, authorAction)
                break
            case'remove_admin':
                const removeMember = newThread.members.cache.get(event.logMessageData.TARGET_ID)
                client.emit(Events.ThreadAdminRemove, removeMember, authorAction)
                break
            default: console.warn(event)
        }
    } else {
        const authorAction = thread.members.cache.get(event.author)
        switch(event.logMessageData.ADMIN_EVENT) {
            case'add_admin':
                const addMember = thread.members.cache.get(event.logMessageData.TARGET_ID)
                addMember.isAdmin = true
                client.emit(Events.ThreadAdminAdd, addMember, authorAction)
                break
            case'remove_admin':
                const removeMember = thread.members.cache.get(event.logMessageData.TARGET_ID)
                removeMember.isAdmin = false
                client.emit(Events.ThreadAdminRemove, removeMember, authorAction)
                break
            default: console.warn(event)
        }
    }
}