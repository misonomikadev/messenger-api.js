const { Collection } = require("@discordjs/collection")
const User = require("../structures/User")

class FriendUserManager {
    constructor(client, friends) {
        this.client = client
        this.cache = friends.reduce(
            (cache, friend) => cache.set(friend.id, new User(client, friend)),
            new Collection()
        )
    }

    async remove(id) {
        const user = this.cache.get(id)
        if (!user) throw new Error('This user is not your friend.')
        await this.client.api.unfriend(id)
        this.cache.delete(id)
        return user
    }

    async fetch() {
        const friends = await this.client.api.getFriendsList()
        const cache = friends.reduce(
            (cache, friend) => cache.set(friend.id, new User(client, friend)),
            new Collection()
        )

        this.cache = cache
        return cache
    }
}

module.exports = FriendUserManager