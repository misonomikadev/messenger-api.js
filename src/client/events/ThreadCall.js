const Thread = require('../../structures/Thread')
const Events = require('../../enums/Events')

module.exports = async function(client, event) {
    const thread = client.threads.cache.get(event.threadID)
    
    if (!thread) {
        const fetched = await client.api.getThreadInfo(event.threadID)
        const newThread = new Thread(client, fetched)

        client.threads.cache.set(event.threadID, newThread)

        if ('joining_user' in event.logMessageData) {
            const joiningMember = newThread.members.cache.get(event.logMessageData.joining_user)
            return client.emit(Events.ThreadCallJoin, joiningMember)
        }

        switch(event.logMessageData.event) {
            case'group_call_started':
                const startData = {
                    thread: newThread,
                    conferenceName: event.logMessageData.conference_name,
                    caller: newThread.members.cache.get(event.logMessageData.caller_id),
                    token: event.logMessageData.server_info,
                    isVideoCall: event.logMessageData.video === '1',
                    membersMissedCall: [],
                    duration: 0
                }

                return client.emit(Events.ThreadCallStart, startData)    
            case'group_call_ended':
                const endData = {
                    thread: newThread,
                    token: event.logMessageData.server_info,
                    duration: Number(event.logMessageData.call_duration),
                    conferenceName: event.logMessageData.conference_name,
                    membersMissedCall: JSON.parse(event.logMessageData.missed_call_participant_ids)
                        .map(member_id => newThread.members.cache.get(member_id)),
                    caller: newThread.members.cache.get(event.logMessageData.caller_id),
                    isVideoCall: event.logMessageData.video === '1'
                }

                return client.emit(Events.ThreadCallEnd, endData)
            default: console.warn(event)
        }
    } else {
        if ('joining_user' in event.logMessageData) {
            const joiningMember = thread.members.cache.get(event.logMessageData.joining_user)
            return client.emit(Events.ThreadCallJoin, joiningMember)
        }

        switch(event.logMessageData.event) {
            case'group_call_started':
                thread.callRoom.state = 'ONGOING_CALL'
                thread.callRoom.token = event.logMessageData.server_info

                const startData = {
                    thread: thread,
                    conferenceName: event.logMessageData.conference_name,
                    caller: thread.members.cache.get(event.logMessageData.caller_id),
                    token: event.logMessageData.server_info,
                    isVideoCall: event.logMessageData.video === '1',
                    membersMissedCall: [],
                    duration: 0
                }

                return client.emit(Events.ThreadCallStart, startData)    
            case'group_call_ended':
                thread.callRoom.state = 'NO_ONGOING_CALL'
                thread.callRoom.token = ''

                const endData = {
                    thread: thread,
                    token: event.logMessageData.server_info,
                    duration: Number(event.logMessageData.call_duration),
                    conferenceName: event.logMessageData.conference_name,
                    membersMissedCall: JSON.parse(event.logMessageData.missed_call_participant_ids)
                        .map(member_id => thread.members.cache.get(member_id)),
                    caller: thread.members.cache.get(event.logMessageData.caller_id),
                    isVideoCall: event.logMessageData.video === '1'
                }

                return client.emit(Events.ThreadCallEnd, endData)
            default: console.warn(event)
        }
    }
}