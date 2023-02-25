const Events = require('../../enums/Events')
const Thread = require('../../structures/Thread')
const MessageReaction = require('../../structures/MessageReaction')

module.exports = async function(client, event) {
    const thread = client.threads.cache.get(event.threadID)
        ?? await client.api.getThreadInfo(event.threadID).then(
            async thread => {
                const fetched = new Thread(client, thread)
                client.threads.cache.set(fetched.id, fetched)
                await fetched.messages.fetch(event.messageID)
                return fetched
            }
        ).catch(async () => {
            console.warn(event)
            throw new Error(`Thread with ID: ${event.threadID} was deleted but still listen reaction event, please try again.`)
        })
    
    const message = thread.messages.cache.get(event.messageID)
        ?? await thread.messages.fetch(event.messageID)
    
    switch(event.action) {
        case'Add':
            const addReaction = message.reactions.cache.get(event.reaction)
            const addMember = thread.members.cache.get(event.userID)

            if (!addReaction) {
                const reaction = new MessageReaction(message, event.reaction)

                const reactionBefore = message.reactions.cache.find(react => react.members.cache.has(event.userID))
                if (reactionBefore) {
                    if (reactionBefore.members.cache.size === 1) {
                        message.reactions.cache.delete(reactionBefore.emoji)
                    } else {
                        reactionBefore.members.cache.delete(event.userID)
                    }
                }
                    
                reaction.members.cache.set(event.userID, addMember)
                message.reactions.cache.set(event.reaction, reaction)
                client.emit(Events.MessageReactionAdd, reaction, addMember)
            } else {
                addReaction.members.cache.set(event.userID, addMember)
                client.emit(Events.MessageReactionAdd, addReaction, addMember)
            }
            break
        case'Remove':
            const removeMember = thread.members.cache.get(event.userID)
            const removeReaction = message.reactions.cache.find(reaction => reaction.members.cache.has(event.userID))
                ?? new MessageReaction(message, '')
                
            if (removeReaction.members.cache.size === 1) {
                message.reactions.cache.delete(removeReaction.emoji)
                removeReaction.members.cache.delete(event.userID)
            } else if (removeReaction.emoji) {
                removeReaction.members.cache.delete(event.userID)
            }
                
            client.emit(Events.MessageReactionRemove, removeReaction, removeMember)
            break
        default: break
    }
}