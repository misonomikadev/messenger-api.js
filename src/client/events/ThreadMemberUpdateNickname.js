const Events = require('../../enums/Events')
const Thread = require('../../structures/Thread')

module.exports = async function(client, event) {
    const thread = client.threads.cache.get(event.threadID)

    if (!thread) {
        const fetchThread = await client.api.getThreadInfo(event.threadID)
        const newThread = new Thread(client, fetchThread)
        const actionMember = newThread.members.cache.get(event.author)
        const member = newThread.members.cache.get(event.logMessageData.participant_id)
        
        if (!newThread.isGroup) newThread.name = member.displayName
        client.threads.cache.set(event.threadID, newThread)
        client.emit(Events.ThreadMemberNicknameUpdate, member, actionMember)
    } else {
        const actionMember = thread.members.cache.get(event.author)
        const member = thread.members.cache.get(event.logMessageData.participant_id)
        member.nickname = event.logMessageData.nickname
        if (!thread.isGroup) thread.name = member.displayName

        client.emit(Events.ThreadMemberNicknameUpdate, member, actionMember)
    }
}