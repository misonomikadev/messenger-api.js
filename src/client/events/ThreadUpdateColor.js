const Events = require('../../enums/Events')
const Thread = require('../../structures/Thread')

module.exports = async function(client, event) {
    const data = {
        gradient: event.logMessageData.gradient
            && JSON.parse(event.logMessageData.gradient).map(color => `#${color.toLowerCase()}`),
        emoji: event.logMessageData.theme_emoji,
        id: event.logMessageData.theme_id,
        name: event.logMessageData.theme_name_with_subtitle,
        color: `#${event.logMessageData.theme_color.toLowerCase()}`
    }

    const thread = client.threads.cache.get(event.threadID)

    if (!thread) {
        const fetched = await client.api.getThreadInfo(event.threadID)
        const newThread = new Thread(client, fetched)
        const authorMember = newThread.members.cache.get(event.author)

        client.emit(Events.ThreadColorUpdate, newThread, data, authorMember)
        client.threads.cache.set(event.threadID, newThread)
        if (data.emoji) {
            client.emit(Events.ThreadEmojiUpdate, newThread, authorMember)
        }
    } else {
        const authorMember = thread.members.cache.get(event.author)
        thread.color = data.color
        client.emit(Events.ThreadColorUpdate, thread, data, authorMember)
        if (data.emoji) {
            thread.emoji = data.emoji
            client.emit(Events.ThreadEmojiUpdate, thread, authorMember)
        }
    }
}