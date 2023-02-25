const ReactionUserManager = require('../managers/ReactionUserManager')

class MessageReaction {
    constructor(message, emoji) {
        Object.defineProperty(this, 'emoji', {
            value: emoji,
            writable: false
        })
        this.client = message.client
        this.message = message
        this.members = new ReactionUserManager(this)
    }

    get count() {
        return this.members.cache.size
    }

    get me() {
        return this.members.cache.has(this.client.user.id)
    }

    react() {
        return this.message.react(this.emoji)
    }

    remove() {
        return this.client.api.setMessageReaction('', this.message.id)
    }

    /**
     * Get the url of the emoji.
     * @param {32 | 64 | 128} size 
     * @param {1 | 1.5} pixelRatio
     * @returns {string}
     */
    getEmojiUrl(size = 32, pixelRatio = 1) {
        return this.client.getEmojiUrl(this.emoji, size, pixelRatio)
    }
}

module.exports = MessageReaction