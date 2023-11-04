const Events = require('../../enums/Events')
const Message = require('../../structures/Message')
const Thread = require('../../structures/Thread')

module.exports = async function (client, message) {
    const thread = client.threads.cache.get(message.threadID)
    if (!thread) {
        const threadFetch = await client.api.getThreadInfo(message.threadID)
        const newThread = new Thread(client, threadFetch)
        const msg = new Message(client, {
            thread: newThread,
            author: newThread.members.cache.get(message.senderID),
            repliedMessage:
                message.messageReply ?
                    new Message(client, {
                        thread: newThread,
                        author: newThread.members.cache.get(message.messageReply.senderID).user,
                        ...message.messageReply
                    })
                    : null
            ,
            ...message
        })

        newThread.messages.cache.set(msg.id, msg)
        client.threads.cache.set(message.threadID, newThread)

        client.emit(Events.MessageReply, msg)
        client.emit(Events.MessageCreate, msg)
    } else {
        const msg = new Message(client, {
            thread: thread,
            author: thread.members.cache.get(message.senderID),
            repliedMessage:
                message.messageReply ?
                    new Message(client, {
                        thread: thread,
                        author: thread.members.cache.get(message.messageReply.senderID).user,
                        ...message.messageReply
                    })
                    : null
            ,
            ...message
        })

        thread.messages.cache.set(msg.id, msg)

        client.emit(Events.MessageReply, msg)
        client.emit(Events.MessageCreate, msg)
    }
}