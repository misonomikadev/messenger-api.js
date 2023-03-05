const Utils = require('../client/Utils')
const User = Utils.lazy(() => require('./User'))

class ThreadMember {
    constructor(thread, member) {
        this.thread = thread
        this.user = new (User())(thread.client, member)

        this.id = this.user.id
        this.nickname = (Array.isArray(thread._raw.nicknames)
            ? thread._raw.nicknames.find(nickname => nickname.userID === this.id)?.nickname
            : thread._raw.nicknames[this.id]) ?? null
    }
    
    get displayName() {
        return this.nickname ?? this.user.username ?? null
    }

    get isAdmin() {
        return this.thread.admins.cache.has(this.id)
    }

    send(message, returnMessage = false) {
        return this.user.send(message, returnMessage)
    }

    async kick() {
        if (!this.thread.isGroup) throw new Error('This thread isn\'t a group.')
        if (!this.thread.members.me.isAdmin) throw new Error('Missing Permission')

        await this.thread.client.api.removeUserFromGroup(this.id, this.thread.id)
        return this
    }

    async setNickname(nickname = '') {
        await this.thread.client.api.changeNickname(nickname, this.thread.id, this.id)
        this.nickname = nickname
        return this
    }

    async makeAdmin() {
        if (!this.thread.members.me.isAdmin) throw new Error()
        if (this.isAdmin) throw new Error()
        await this.thread.client.api.changeAdminStatus(this.id, this.thread.id, true)
        return this
    }

    async removeAdmin() {
        if (!this.thread.members.me.isAdmin) throw new Error()
        if (!this.isAdmin) throw new Error()
        await this.thread.client.api.changeAdminStatus(this.id, this.thread.id, false)
        return this
    }

    async fetch() {
        const thread = await this.thread.fetch()
        const member = thread.members.cache.get(this.id)

        this.avatarUrl = member.user.avatarUrl
        this.user = member.user
        this.id = member.id
        this.thread = thread

        return this
    }

    toString() {
        return `@${this.displayName}`
    }
}

module.exports = ThreadMember