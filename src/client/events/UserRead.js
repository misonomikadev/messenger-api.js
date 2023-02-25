const Events = require('../../enums/Events')

module.exports = function(client, event) {
    const thread = client.threads.cache.get(event.threadID)
    const data = {
        thread: thread,
        reader: thread.members.cache.get(event.reader),
        readedTimestamp: Number(event.time),
    }

    Object.assign(data, { readedAt: new Date(data.readedTimestamp) })
    client.emit(Events.UserRead, data)
}