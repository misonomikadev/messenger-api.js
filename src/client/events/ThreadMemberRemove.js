const Thread = require('../../structures/Thread')
const ThreadMember = require('../../structures/ThreadMember')
const Events = require('../../enums/Events')

module.exports = async function(client, event) {
    const thread = client.threads.cache.get(event.threadID)

    if (!thread) {
        const fetched = await client.api.getThreadInfo(event.threadID)
        const newThread = new Thread(client, fetched)

        if (event.logMessageData.leftParticipantFbId === client.user.id) {
            const author = newThread.members.cache.get(event.author)

            client.emit(Events.GroupLeave, newThread, author)
            client.emit(Events.ThreadMemberRemove, new ThreadMember(newThread, client.user._raw), author)
            return newThread.delete()
        }

        client.threads.cache.set(event.threadID, newThread)
        const actionMember = event.author !== event.logMessageData.leftParticipantFbId
            ? newThread.members.cache.get(event.author) : member

        const user = await client.api.getUserInfo(event.logMessageData.leftParticipantFbId)
        const member = new ThreadMember(newThread, Object.assign(
            user[event.logMessageData.leftParticipantFbId],
            { id: event.logMessageData.leftParticipantFbId })
        )

        client.emit(Events.ThreadMemberRemove, member, actionMember)
    } else {
        const actionMember = thread.members.cache.get(event.author)
        const leaveMember = thread.members.cache.get(event.logMessageData.leftParticipantFbId)

        if (leaveMember.id === client.user.id) {
            client.emit(Events.GroupLeave, thread, actionMember)
            client.emit(Events.ThreadMemberRemove, thread.members.cache.get(client.user.id), actionMember)
            return thread.delete()
        }

        thread.members.cache.delete(event.logMessageData.leftParticipantFbId)
        client.emit(Events.ThreadMemberRemove, leaveMember, actionMember)
    }
}