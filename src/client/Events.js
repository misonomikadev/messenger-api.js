const { Collection } = require('@discordjs/collection')
const MessengerEvent = require('../enum/MessengerEvent')

class Events {
    constructor() {
        this.items = new Collection()
        
        this.register(require('./events/MessageCreate'))
        this.register(require('./events/MessageReaction'))
        this.register(require('./events/MessageReply'))
        this.register(require('./events/MessageUnsend'))
        this.register(require('./events/PresenceUpdate'))
        this.register(require('./events/ThreadAdminChange'))
        this.register(require('./events/ThreadApprovalModeChange'))
        this.register(require('./events/ThreadCall'))
        this.register(require('./events/ThreadImageUpdate'))
        this.register(require('./events/ThreadMemberAdd'))
        this.register(require('./events/ThreadMemberRemove'))
        this.register(require('./events/ThreadMemberUpdateNickname'))
        this.register(require('./events/ThreadPoll'))
        this.register(require('./events/ThreadRename'))
        this.register(require('./events/ThreadUpdateColor'))
        this.register(require('./events/ThreadUpdateEmoji'))
        this.register(require('./events/TypingMesssage'))
        this.register(require('./events/UserRead'))
    }
    
    register(fn) {
        this.items.set(fn.name, fn)
    }
    
    call(client, event) {
        const eventName = event.logMessageType ?? event.type
        const regName = MessengerEvent[eventName]
        
        if (!this.items.has(regName)) return
        this.items.get(regName).call(null, client, event)
    }
}

module.exports = Events