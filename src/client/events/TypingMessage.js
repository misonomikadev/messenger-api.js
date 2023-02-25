const Events = require('../../enums/Events')

module.exports = function(client, event) {
    const thread = client.threads.cache.get(event.threadID)
    const member = thread.members.cache.get(event.from)
    client.emit(Events.MessageTyping, member, event.isTyping)
}