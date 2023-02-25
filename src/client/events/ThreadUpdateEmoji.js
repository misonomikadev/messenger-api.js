const Thread = require('../../structures/Thread')
const Events = require('../../enums/Events')

module.exports = async function(client, event) {
    const thread = client.threads.cache.get(event.threadID)

    const data = {
        emoji: event.logMessageData.thread_icon.length !== 0
            ? event.logMessageData.thread_icon
            : '👍',
        emojiUrl: event.logMessageData.thread_icon_url
            ?? client.api.getEmojiUrl('👍', 128, 1.5)
    }

    if (!thread) {
        const fetched = await client.api.getThreadInfo(event.threadID)
        const newThread = new Thread(client, fetched)
        const authorMember = newThread.members.cache.get(event.author)

        client.emit(Events.ThreadEmojiUpdate, newThread, data, authorMember)
        client.threads.cache.set(event.threadID, newThread)
    } else {
        const authorMember = thread.members.cache.get(event.author)
        thread.emoji = data.emoji
        client.emit(Events.ThreadEmojiUpdate, thread, data, authorMember)
    }
}