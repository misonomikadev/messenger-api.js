const { Collection } = require('@discordjs/collection')
const Thread = require('../structures/Thread')

class ThreadManager {
    constructor(client, threads) {
        this.client = client
        this.cache = threads.reduce(
            (cache, thread) => cache.set(thread.threadID, new Thread(client, thread)),
            new Collection()
        )
    }

    markAsReadAll() {
        return this.client.api.markAsReadAll()
    }

    markAsSeen(timestamp = Date.now()) {
        return this.client.api.markAsSeen(timestamp)
    }

    async create(name, participants) {
        if (typeof name !== 'string') throw new TypeError('Name of the new group must be string.')
        if (!Array.isArray(participants) && !(participants instanceof Collection))
            throw new TypeError('Invalid Array or Collection of User')
        if (participants?.length < 2 || participants.size < 2)
            throw new Error('Must have more 2 participant to create new group.')

        const members = participants.map(member => member && typeof member == 'string' ? member : member.id)
        const id = await this.client.api.createNewGroup(members, name)
        const fetched = await this.client.api.getThreadInfo(id)
        const thread = new Thread(this.client, fetched)
        this.client.threads.cache.set(id, thread)

        return thread
    }

    async fetch() {
        const threads = await api.getThreadList(100, null, [])
        const cache = threads.reduce(
            (cache, thread) => cache.set(thread.threadID, new Thread(client, thread)),
            new Collection()
        )

        this.cache = cache
        return cache
    }
}

module.exports = ThreadManager