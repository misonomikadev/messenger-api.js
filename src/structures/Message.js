const Utils = require('../client/Utils')
const Attachment = require('./Attachment')
const MessageReaction = require('./MessageReaction')
const { Collection } = require('@discordjs/collection')
const ReactionCollector = require('./ReactionCollector')
const ReactionManager = require('../managers/ReactionManager')

class Message {
    constructor(client, message) {
        this.client = client
        this.id = message.messageID
        this.thread = message.thread
        this.threadId = message.threadID
        this.content = message.body
        this.author = message.author
        this.authorId = message.senderID
        this.repliedMessage = message.repliedMessage
        this.member = message.thread.members.cache.get(message.senderID)
        this.attachments = message.attachments.reduce(
            (cache, att) => cache.set(att.ID, new Attachment(client, att)),
            new Collection() 
        )
        this.createdTimestamp = Number(message.timestamp)
        this.deletedTimestamp = null
            
        /** @private */
        this._raw = message
        this.reactions = new ReactionManager(this, message.reactions ?? [])
        this.mentions = Object.keys(message.mentions).reduce(
            (collection, id) => collection.set(id, this.thread.members.cache.get(id)),
            new Collection()
        )
    }

    get deletedAt() {
        return this.deletedTimestamp && new Date(this.deletedTimestamp)
    }

    get createdAt() {
        return new Date(this.createdTimestamp)
    }

    get isClientUser() {
        return this.authorId === this.client.user.id
    }

    awaitReactions(options = {}) {
        return new Promise((resolve, reject) => {
            const collector = new ReactionCollector(this, options)
            collector.once('end', (reactions, reason) => {
                if (options.errors?.includes(reason)) {
                    reject(reactions)
                } else {
                    resolve(reactions)
                }
            })
        })
    }

    async reply(message, options = { returnMessage: false, typing: false }) {
        const resolved = await Utils.resolveMention(this.thread, message)

        let end = null
        if (options.typing) {
            end = await this.client.api.sendTypingIndicator(this.thread.id, null, this.thread.isGroup)
        }

        return this.client.api.sendMessage(resolved, this.thread.id, null, this.id).then(
            async raw => {
                if (options.typing && typeof end === 'function') await end()
                if (options.returnMessage) {
                    const msg = await this.client.api.getMessage(raw.threadID, raw.messageID)
                
                    return new Message(this.client, {
                        thread: this.thread,
                        repliedMessage: new Message(this.client, {
                            thread: this.thread,
                            author: this.thread.members.cache.get(msg.messageReply.senderID),
                            ...msg.messageReply
                        }),
                        author: this.thread.members.cache.get(msg.senderID),
                        ...msg,
                    })
                }

                return raw
            }
        )
    }

    async fetch() {
        const message = await this.client.api.getMessage(this.id)

        this._raw = message
        this.author = this.thread.members.cache.get(message.senderID)
        this.threadId = message.threadID
        this.content = message.body
        this.authorId = message.senderID
        this.reactions = new ReactionManager(this, message.reactions)
        this.repliedMessage = message.messageReply
            ?? new Message(this.client, {
                thread: this.thread,
                author: this.thread.members.cache.get(message.messageReply.senderID).user,
                ...message.messageReply
            })

        this.createdTimestamp = Number(message.timestamp)

        return this
    }

    async react(emoji) {
        if (emoji?.length === 0) throw new Error('This emoji is invalid to react.')
        await this.client.api.setMessageReaction(
            emoji, this.id, err => {throw new Error(err.error)}, true
        )

        return new MessageReaction(this, emoji, this.client.id)
    }

    async delete() {
        await this.client.api.unsendMessage(this.id)
        return this
    }

    async remove() {
        await this.client.api.deleteMessage(this.id)
        return this
    }
}

module.exports = Message