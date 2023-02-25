const Utils = require('../client/Utils')
const Message = require('./Message')

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