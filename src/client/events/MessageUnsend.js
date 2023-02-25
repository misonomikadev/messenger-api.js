const Events = require('../../enums/Events')
const Message = require('../../structures/Message')

module.exports = async function(client, event) {
    const thread = client.threads.cache.get(event.threadID)
    const message = thread.messages.cache.get(event.messageID)
        ?? new Message(client, {
            thread: thread,
            author: thread.members.cache.get(event.senderID),
            threadID: event.threadID,
            messageID: event.messageID,
            senderID: event.senderID,
            mentions: {},
            reactions: [],
            attachments: [],
            body: ''
        })
        
    message.deletedTimestamp = event.deletionTimestamp
    thread.messages.cache.delete(event.messageID)
    client.emit(Events.MessageDelete, message)
}