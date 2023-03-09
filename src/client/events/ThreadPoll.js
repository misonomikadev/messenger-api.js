const Event = require('../../enums/Events')
const Thread = require('../../structures/Thread')
const ThreadPoll = require('../../structures/ThreadPoll')

module.exports = async function(client, event) {
    const thread = client.threads.cache.get(event.threadID)

    const questionData = JSON.parse(event.logMessageData.question_json)
    if (!thread) {
        const fetched = client.api.getThreadInfo(event.threadID)
        const newThread = new Thread(client, fetched)

        const author = newThread.members.cache.get(event.author)
        const poll = new ThreadPoll(newThread, questionData)
        switch(event.logMessageData.event_type) {
            case'question_creation':
                client.emit(Event.ThreadPollCreate, poll, author)
                break
            case'update_vote':
            case'multiple_updates':
            case'add_unvoted_option':
                const updated = {
                    votes: JSON.parse(event.logMessageData.added_option_ids)
                        .map((id, index) => ({ name: poll._raw.selected_option_texts[index], id: id })),
                    unvotes: JSON.parse(event.logMessageData.removed_option_ids)
                        .map((id, index) => ({ name: poll._raw.unselected_option_texts[index], id: id })),
                    adds: JSON.parse(event.logMessageData.new_option_texts)
                }

                client.emit(Event.ThreadPollUpdate, updated, poll, author)
                break
            default: console.warn(event)
        }
    } else {
        const author = thread.members.cache.get(event.author)
        const poll =  new ThreadPoll(thread, questionData)

        switch(event.logMessageData.event_type) {
            case'question_creation':
                client.emit(Event.ThreadPollCreate, poll, author)
                break
            case'update_vote':
            case'multiple_updates':
            case'add_unvoted_option':
                const updated = {
                    votes: JSON.parse(event.logMessageData.added_option_ids)
                        .map((id, index) => ({ name: poll._raw.selected_option_texts[index], id: id })),
                    unvotes: JSON.parse(event.logMessageData.removed_option_ids)
                        .map((id, index) => ({ name: poll._raw.unselected_option_texts[index], id: id })),
                    adds: JSON.parse(event.logMessageData.new_option_texts)
                }

                client.emit(Event.ThreadPollUpdate, updated, poll, author)
                break
            default: console.warn(event)
        }
    }
}