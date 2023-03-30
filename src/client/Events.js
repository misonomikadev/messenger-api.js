const { Collection } = require('@discordjs/collection')
const MessengerEvent = require('../enums/MessengerEvent')

class BotEvents {
    constructor() {
        this.items = new Collection()
        
        this.items.set('MessageCreate', require('./events/MessageCreate'))
        this.items.set('MessageReaction', require('./events/MessageReaction'))
        this.items.set('MessageReply', require('./events/MessageReply'))
        this.items.set('MessageUnsend', require('./events/MessageUnsend'))
        this.items.set('PresenceUpdate', require('./events/PresenceUpdate'))
        this.items.set('ThreadAdminsChange', require('./events/ThreadAdminsChange'))
        this.items.set('ThreadApprovalModeChange', require('./events/ThreadApprovalModeChange'))
        this.items.set('ThreadCall', require('./events/ThreadCall'))
        this.items.set('ThreadImageUpdate', require('./events/ThreadImageUpdate'))
        this.items.set('ThreadMemberAdd', require('./events/ThreadMemberAdd'))
        this.items.set('ThreadMemberRemove', require('./events/ThreadMemberRemove'))
        this.items.set('ThreadMemberUpdateNickname', require('./events/ThreadMemberUpdateNickname'))
        this.items.set('ThreadPoll', require('./events/ThreadPoll'))
        this.items.set('ThreadRename', require('./events/ThreadRename'))
        this.items.set('ThreadUpdateColor', require('./events/ThreadUpdateColor'))
        this.items.set('ThreadUpdateEmoji', require('./events/ThreadUpdateEmoji'))
        this.items.set('TypingMessage', require('./events/TypingMessage'))
        this.items.set('UserRead', require('./events/UserRead'))
    }
    
    call(client, event) {
        const eventName = event.type === 'event' ? event.logMessageData : event.type
        const regName = MessengerEvent[eventName]
        
        if (!this.items.has(regName)) return console.warn(regName)
        this.items.get(regName).call(null, client, event)
    }
}

module.exports = BotEvents