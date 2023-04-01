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
        this.invite = thread.invite
        
        this.members = new ThreadMemberManager(this, thread.participants)
        this.admins = new ThreadAdminManager(this)
        this.messages = new MessageManager(this)
        
        if (!thread.isGroup) {
            const userDMs = this.members.cache.get(this.id)

            this.name = userDMs?.displayName
            this.iconUrl = userDMs?.user.avatarUrl
        } else {
            this.name = thread.name
                ?? thread.participants.map(m => m.firstName).join(', ')
            
            this.iconUrl = thread.thumbSrc ?? thread.imageSrc
        }
    }

    async send(message, options = { returnMessage: false, typing: false }) {
        const resolved = await Utils.resolveMention(this, message)

        let end = null
        if (options.typing) {
            end = await this.client.api.sendTypingIndicator(this.id, null, this.isGroup)
        }

        return this.client.api.sendMessage(resolved, this.id).then(
            async raw => {
                if (options.typing && typeof end === 'function') await end()
                if (options.returnMessage) {
                    const msg = await this.client.api.getMessage(raw.threadID, raw.messageID)
                
                    return new Message(this.client, {
                        thread: this,
                        author: this.members.me.user,
                        ...msg,
                    })
                }

                return raw
            }
        )
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

    async sendTyping() {
        const stopFunc = await this.client.api.sendTypingIndicator(this.id)
        const timeout = setTimeout(() => stopFunc(), 30000)

        return () => {
            clearTimeout(timeout)
            stopFunc()
        }
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
        if (typeof name !== 'string') throw new TypeError('Type of name is not string.')
        if (!this.isGroup) throw new Error()

        await this.client.api.setTitle(name, this.id)
        this.name = name
        return this
    }

    async setIcon(image) {
        if (!this.isGroup) throw new Error('This is not a group.')
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

    // async fetchHistory(options) {
    //     if (typeof options.amount !== 'number') throw new TypeError()
    //     const history = await this.client.api.getThreadHistory(
    //         this.id, options.amount, options.timestamp ?? null
    //     )
        
    //     return
    // }
}

module.exports = Thread