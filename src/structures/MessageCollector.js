const Collector = require('./interfaces/Collector')
const Events = require('../enums/Events')

class MessageCollector extends Collector {
    constructor(thread, options = {}) {
        super(thread.client, options)

        this.thread = thread
        this.received = 0

        this._handleThreadDeletion = this._handleThreadDeletion.bind(this)

        this.client.incrementMaxListeners()
        this.client.on(Events.MessageCreate, this.handleCollect)
        this.client.on(Events.MessageDelete, this.handleDispose)

        this.once('end', () => {
            this.client.removeListener(Events.MessageCreate, this.handleCollect)
            this.client.removeListener(Events.MessageDelete, this.handleDispose)
            this.client.decrementMaxListeners()
        })
    }

    get endReason() {
        if (this.options.max && this.collected.size >= this.options.max) return 'limit'
        if (this.options.maxProcessed && this.received === this.options.maxProcessed) return 'processedLimit'
        return super.endReason
    }

    collect(message) {
        if (message.threadId !== this.thread.id) return null
        this.received++
        return message.id
    }

    dispose(message) {
        return message.threadId === this.thread.id ? message.id : null
    }

    _handleThreadDeletion(thread) {
        if (thread.id === this.thread.id) {
            this.stop('threadDelete')
        }
    }
}

module.exports = MessageCollector