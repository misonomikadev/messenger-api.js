const Utils = require('../client/Utils')

module.exports = Utils.createEnum({
    MessageCreate: 'message',
    TypingMessage: 'typ',
    UserRead: 'read_receipt',
    MessageReaction: 'message_reaction',
    ThreadImageUpdate: 'change_thread_image',
    MessageUnsend: 'message_unsend',
    MessageReply: 'message_reply',
    PresenceUpdate: 'presence',
    ThreadUpdateEmoji: 'log:thread-icon',
    ThreadRename: 'log:thread-name',
    ThreadUpdateColor: 'log:thread-color',
    ThreadMemberUpdateNickname: 'log:user-nickname',
    ThreadMemberAdd: 'log:subscribe',
    ThreadMemberRemove: 'log:unsubscribe',
    ThreadApprovalModeChange: 'log:thread-approval-mode',
    ThreadAdminsChange: 'log:thread-admins',
    ThreadCall: 'log:thread-call',
    ThreadPoll: 'log:thread-poll',
})