const { Collection } = require("@discordjs/collection")

class ReactionUserManager {
    constructor(reaction) {
        this.client = reaction.client
        this.reaction = reaction
        this.cache = reaction.message._raw.reactions
            ? reaction.message._raw.reactions.filter(react => react.reaction === reaction.emoji)
                .reduce((cache, react) => {
                    const userID = react.userID ?? react.user.id
                    return cache.set(userID, reaction.message.thread.members.cache.get(userID))
                }, new Collection())
            : new Collection()
    }

    async fetch() {
        const fetchedMessage = await this.reaction.message.fetch()
        const reaction = fetchedMessage.reactions.cache.get(this.reaction.emoji)
        this.cache = reaction.members.cache
        
        return reaction.members.cache
    }
}

module.exports = ReactionUserManager