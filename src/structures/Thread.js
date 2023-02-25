const MessageCollector = require('./MessageCollector')
const MessageManager = require('../managers/MessageManager')
const ThreadMemberManager = require('../managers/ThreadMemberManager')
const ThreadAdminManager = require('../managers/ThreadAdminManager')
const Utils = require('../client/Utils')
const Message = require('./Message')

class Thread {
    constructor(client, thread) {
        this.client = client
        /** @private */
        this._raw = thread

        this.type = thread.folder
        this.color = thread.color ? `#${thread.color.toLowerCase()}` : '#ff0099ff'
        this.emoji = thread.emoji ?? '👍'
        this.id = thread.threadID
        this.isGroup = thread.isGroup
        this.requireApproval = thread.approvalMode
        
        
        this.members = new ThreadMemberManager(this, thread.participants)
        this.admins = new ThreadAdminManager(this)
        this.messages = new MessageManager(this)
        
        this.iconUrl = !thread.isGroup
            ? this.members.cache.get(this.id).user.avatarUrl
            : thread.thumbSrc
        // this.lastEventMessage = thread.snippet
        // this.lastAuthorEventMessage = this.members.cache.get(thread.snippet.snippetSender)

        this.name = this.isGroup
            ? (thread.name ?? thread.participants.map(m => m.firstName).join(', '))
            : this.members.cache.get(this.id).displayName
    }

    async send(message, returnMessage = false) {
        const resolved = await Utils.resolveMention(this.thread, message)
        const raw = await this.client.api.sendMessage(resolved, this.id)
        
        if (returnMessage) {
            const msg = await this.client.api.getMessage(raw.threadID, raw.messageID)

            return new Message(this.client, {
                thread: this,
                repliedMessage: null,
                author: this.members.cache.get(msg.senderID),
                ...msg,
            })
        }

        return raw
    }

    awaitMessages(options = {}) {
        return new Promise((resolve, reject) => {
            const collector = new MessageCollector(this, options)
            collector.once('end', (collection, reason) => {
                if (options.errors?.includes(reason)) {
                    reject(collection)
                } else {
                    resolve(collection)
                }
            })
        })
    }

    async createPoll(title, pollOptions) {
        if (!title || typeof title !== 'string') throw new TypeError('Invalid poll title to create.')
        if (!pollOptions || !Array.isArray(pollOptions)) throw new TypeError('Invalid poll options.')
        if (pollOptions.length == 0) throw new Error('Poll options must have 1 option.')

        const options = pollOptions.reduce(
            (obj, option) => {
                if (!option.name) throw new Error('Missing name of the poll option.')
                return Object.assign(obj, { [option.name]: !!option.vote })
            }, {}
        )

        await this.client.api.createPoll(title, this.id, options)
    }

    async setColor(color) {
        await this.client.api.changeThreadColor(color, this.id)
        this.color = color
        return this
    }

    async setName(name) {
        if (typeof name !== 'string') throw new TypeError()
        if (!this.isGroup) throw new Error()

        await this.client.api.setTitle(name, this.id)
        this.name = name
        return this
    }

    async setIcon(image) {
        if (!this.isGroup) throw new Error()
        await this.client.api.changeGroupImage(image, this.id)
        return this
    }

    async setEmoji(emoji) {
        await this.client.api.changeThreadEmoji(emoji, this.id)
        return this
    }

    async fetch() {
        const updatedThread = await this.client.api.getThreadInfo(this.id)
        
        this.members = new ThreadMemberManager(this, updatedThread.participants)
        this.admins = new ThreadAdminManager(this)

        this.color = updatedThread.color ?? '#ff0099ff'
        this.emoji = updatedThread.emoji ?? '👍'
        this.name = updatedThread.isGroup
            ? (updatedThread.name ?? updatedThread.participants.map(m => m.firstName).join(', '))
            : this.members.cache.get(this.id).displayName
        this.type = updatedThread.threadType
        this.isGroup = updatedThread.isGroup
        this.iconUrl = updatedThread.imageSrc
        this._raw = updatedThread
        
        return this
    }

    mute(seconds) {
        if (seconds < 0) throw new Error()
        return this.client.api.muteThread(this.id, seconds)
    }

    unmute() {
        return this.client.api.muteThread(this.id, 0)
    }

    async delete() {
        await this.client.api.deleteThread(this.id)
        this.client.threads.cache.delete(this.id)
        return this
    }

    archive() {
        return this.client.api.changeArchivedStatus(this.id, true)
    }

    unarchive() {
        return this.client.api.changeArchivedStatus(this.id, false)
    }

    async leave() {
        if (!this.isGroup) throw new Error()
        await this.members.me.kick()
        this.client.threads.cache.delete(this.id)
        return this
    }

    // async fetchHistory(amount, timestamp = null) {
    //     if (typeof amount !== 'number') throw new TypeError()
    //     const histories = await this.client.api.getThreadHistory(this.id, amount, timestamp)
        
    //     return
    // }
}

module.exports = Thread