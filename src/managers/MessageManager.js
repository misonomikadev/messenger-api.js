const Message = require('../structures/Message')
const { Collection } = require('@discordjs/collection')

class MessageManager {
    constructor(thread) {
        this.thread = thread
        this.cache = new Collection()
    }

    markAsRead() {
        return this.thread.client.api.markAsRead(this.thread.id, true) 
    }

    markAsUnread() {
        return this.thread.client.api.markAsRead(this.thread.id, false) 
    }

    async fetchHistory(amount, timestamp = null) {
        if (typeof amount !== 'number') throw new TypeError('Missing `amount` parameter.')
        const history = await this.thread.client.api.getThreadHistory(this.thread.id, amount, timestamp)
        
        const collection = new Collection()
        const filtered = history.filter(msg => msg.type == 'message')
        
        filtered.forEach(msg => {
            collection.set(msg.messageID, new Message(this.thread.client, {
                thread: this.thread,
                author: this.thread.members.cache.get(msg.senderID),
                ...msg
            }))
        })

        return collection
    }

    async fetch(messageID) {
        if (!messageID) throw new Error('Invalid message id.')

        const msg = await this.thread.client.api.getMessage(this.thread.id, messageID)
        if (!msg) return null

        const message = new Message(this.thread.client, {
            thread: this.thread,
            author: this.thread.members.cache.get(msg.senderID),
            repliedMessage: msg.messageReply
                && new Message(this.thread.client, {
                    thread: this.thread,
                    author: this.thread.members.cache.get(msg.messageReply.senderID),
                    ...msg.messageReply
                }), 
            ...msg
        })

        this.cache.set(message.id, message)
        return message
    }
}

module.exports = MessageManager