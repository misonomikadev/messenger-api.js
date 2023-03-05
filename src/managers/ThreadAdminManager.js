const { Collection } = require('@discordjs/collection')

class ThreadAdminManager {
    constructor(thread) {
        this.client = thread.client
        this.thread = thread
        this.cache = thread._raw.adminIDs.reduce(
            (cache, admin) => typeof admin === 'object'
                ? cache.set(admin.id, thread.members.cache.get(admin.id))
                : cache.set(admin, thread.members.cache.get(admin)),
            new Collection()
        )
    }

    async add(id) {
        if (typeof id !== 'string') throw new TypeError('New admin id must be a string.')
        if (!this.cache.has(this.client.user.id)) throw new Error()

        const member = this.thread.members.cache.get(id)
        if (!member) throw new Error()
        if (member.isAdmin) throw new Error()

        await this.client.api.changeAdminStatus(this.thread.id, id, true)
        return member
    }

    async remove(id) {
        if (typeof id !== 'string') throw new TypeError()
        if (!this.cache.has(this.client.user.id)) throw new Error()

        const member = this.thread.members.cache.get(id)
        if (!member) throw new Error()
        if (!member.isAdmin) throw new Error()

        await this.client.api.changeAdminStatus(this.thread.id, id, false)
        return member
    }

    async fetch() {
        const fetchedThread = await this.thread.fetch()
        this.cache = fetchedThread.admins.cache
        return fetchedThread.admins.cache
    }
}

module.exports = ThreadAdminManager