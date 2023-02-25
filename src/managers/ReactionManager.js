const { Collection } = require('@discordjs/collection')
const MessageReaction = require('../structures/MessageReaction')

class ReactionManager {
    constructor(message, reactions) {
        this.client = message.client
        this.message = message
        this.cache = reactions.reduce(
            (cache, reaction) => 
                cache.set(reaction.reaction, new MessageReaction(message, reaction.reaction)),
            new Collection()
        )
    }

    get me() {
        return this.cache.find(reaction => reaction.me)
    }

    async fetch() {
        const message = await this.message.fetch()
        this.cache = message.reactions.cache
        this.message = message

        return this
    }

    /**
     * Get the url of the emoji.
     * @param {string} emoji 
     * @param {32 | 64 | 128} size 
     * @param {1 | 1.5} pixelRatio
     * @returns {string}
     */
    getEmojiUrl(emoji, size = 32, pixelRatio = 1) {
        return this.client.getEmojiUrl(emoji, size, pixelRatio)
    }
}

module.exports = ReactionManager