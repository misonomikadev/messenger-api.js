const Thread = require('../../structures/Thread')
const Events = require('../../enums/Events')

module.exports = async function(client, event) {
    const thread = client.threads.cache.get(event.threadID)

    if (!thread) {
        const fetched = await client.api.getThreadInfo(event.threadID)
        const newThread = new Thread(client, fetched)
        const inviter = newThread.members.cache.get(event.author)

        client.threads.cache.set(event.threadID, newThread)
        event.logMessageData.addedParticipants.forEach(
            raw => {
                const member = newThread.members.cache.get(raw.userFbId)
                const lastLeaveThread = new Date(Number(raw.lastUnsubscribeTimestampMs))
                if (member.id === client.user.id) {
                    client.emit(Events.GroupJoin, newThread, inviter)
                }

                client.emit(Events.ThreadMemberAdd, member, inviter, lastLeaveThread)
            }
        )
        
    } else {
        const fetchMembers = await thread.members.fetch()
        const inviter = fetchMembers.get(event.author)

        event.logMessageData.addedParticipants.forEach(
            raw => {
                const member = fetchMembers.get(raw.userFbId)
                const lastLeaveThread = new Date(Number(raw.lastUnsubscribeTimestampMs))
                client.emit(Events.ThreadMemberAdd, member, inviter, lastLeaveThread)
            }
        )
    }
}