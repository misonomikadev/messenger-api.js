const { Collection } = require('@discordjs/collection')
const Collector = require('./interfaces/Collector')
const Events = require('../enums/Events')

class ReactionCollector extends Collector {
    constructor(message, options = {}) {
        super(message.client, options)

        this.message = message
        this.members = new Collection()
        this.total = 0

        this.client.incrementMaxListeners()
        this.client.on(Events.MessageReactionAdd, this.handleCollect)
        this.client.on(Events.MessageReactionRemove, this.handleDispose)|
        this.client.on(Events.GroupLeave, this._handleThreadDeletion)

        this.once('end', () => {
            this.client.removeListener(Events.MessageReactionAdd, this.handleCollect)
            this.client.removeListener(Events.MessageReactionRemove, this.handleDispose)
            this.client.removeListener(Events.GroupLeave, this._handleThreadDeletion)
            this.client.decrementMaxListeners()
        })

        this.on('collect', (reaction, member) => {
            if (reaction.count === 1) {
                this.emit('create', reaction, member)
            }
            
            this.total++
            this.members.set(member.id, member)
        })

        this.on('remove', (reaction, member) => {
            this.total--

            if (!this.collected.some(r => r.members.cache.has(member.id)))
                this.members.delete(member.id)
        })
    }

    collect(reaction) {
        if (reaction.message.id !== this.message.id) return null
        return reaction.emoji
    }

    dispose(reaction, member) {
        if (reaction.message.id !== this.message.id) return null
        if (this.collected.has(reaction.emoji) && this.members.has(member.id)) {
            this.emit('remove', reaction, member)
        }

        return reaction.count ? null : reaction.emoji
    }

    get endReason() {
        if (this.options.max && this.total >= this.options.max) return 'limit';
        if (this.options.maxEmojis && this.collected.size >= this.options.maxEmojis) return 'emojiLimit';
        if (this.options.maxUsers && this.users.size >= this.options.maxUsers) return 'userLimit';
        return super.endReason;
    }

    _handleThreadDeletion(thread) {
        if (thread.id === this.thread.id) {
            this.stop('threadDelete')
        }
    }
}

module.exports = ReactionCollector