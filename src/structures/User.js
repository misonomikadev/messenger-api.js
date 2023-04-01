const Utils = require('../client/Utils')
const Message = require('../structures/Message')
const Thread = require('../structures/Thread')

class User {
    constructor(client, user) {
        this.client = client
        this.id = user.id ?? user.userID
        this.username = user.name ?? user.fullName
        this.shortName = user.firstName ?? user.shortName
        this.profileUrl = user.profileUrl ?? user.url
        this.avatarUrl = user.thumbSrc ?? user.profilePicture
        this.type = user.type?.toUpperCase()
        this.vanity = user.vanity ?? ""
        /** @private */
        this._raw = user
    }

    get alternateName() {
        return this._raw.alternateName ?? ""
    }

    get isFriend() {
        return this.client.friends.cache.has(this.id)
    }

    get isBirthday() {
        return !!this._raw.isBirthday
    }

    get gender() {
        return this._raw.gender
    }

    async fetch() {
        const fetchedUser = await this.client.api.getUserInfo(this.id)
        const user = Object.assign(fetchedUser[this.id], { id: this.id })

        this.username = fetchedUser.name
        this.shortName = fetchedUser.firstName
        this.profileUrL = fetchedUser.profileUrl
        this.avatarUrl = user.thumbSrc
        this.vanity = user.vanity
        this._raw = user

        return this
    }

    async send(message, options = { returnMessage: false, typing: false }) {
        const thread = this.client.threads.cache.get(this.id)
        const resolved = await Utils.resolveMention(thread, message)

        let end = null
        if (options.typing) {
            end = await this.client.api.sendTypingIndicator(this.id, null, false)
        }

        const raw = await this.client.api.sendMessage(resolved, this.id)

        if (options.typing && typeof end === 'function') await end()
        if (options.returnMessage) {
            const msg = await this.client.api.getMessage(raw.threadID, raw.messageID)
            if (!thread) {
                const fetchedThread = await this.client.api.getThreadInfo(this.id)
                const newThread = new Thread(this.client, fetchedThread)

                this.client.threads.set(newThread.id, newThread)
                return new Message(this.client, {
                    thread: newThread,
                    author: newThread.members.me.user,
                    ...msg
                })
            } else {
                return new Message(this.client, {
                    thread: thread,
                    author: thread.members.me.user,
                    ...msg
                })
            }
        }

        return raw
    }

    block() {
        return this.client.api.changeBlockedStatus(this.id, true)
    }

    unblock() {
        return this.client.api.changeBlockedStatus(this.id, false)
    }

    async unfriend() {
        if (!this.isFriend) throw new Error('This user isn\'t your friend.')
        await this.client.api.unfriend(this.id)
        this.client.friends.cache.delete(this.id)
        return this
    }

    toString() {
        return `@${this.username}`
    }
}

module.exports = User