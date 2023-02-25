const { Collection } = require('@discordjs/collection')
const ThreadMember = require('../structures/ThreadMember')

class ThreadMemberManager {
    constructor(thread, members) {
        this.thread = thread
        this.cache = members.reduce(
            (cache, member) => cache.set(
                member.userID ?? member.id, new ThreadMember(thread, member)),
            new Collection()
        )
    }

    get me() {
        return this.cache.get(this.thread.client.user.id)
    }

    async fetch() {
        const updatedThread = await this.thread.fetch()
        const cache = updatedThread._raw.participants.reduce(
            (cache, member) => cache.set(member.id, new ThreadMember(updatedThread, member)),
            new Collection()
        )

        this.thread = updatedThread
        this.cache = cache

        return cache
    }
}

module.exports = ThreadMemberManager