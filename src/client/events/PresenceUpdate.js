const Events = require('../../enums/Events')

module.exports = function(client, event) {
    client.emit(Events.PresenceUpdate, {
        user: client.friends.cache.get(event.userID) ?? event.userID,
        status: event.statuses === 0 ? 'idle' : 'online',
        timestamp: Date.now()
    })
}