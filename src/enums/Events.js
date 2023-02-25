const Utils = require('../client/Utils')

module.exports = Utils.createEnum({    
    ThreadMemberNicknameUpdate: 'threadMemberNicknameUpdate',
    ThreadApprovalModeOff: 'threadApprovalModeOff',
    MessageReactionRemove: 'messageReactionRemove',
    ThreadApprovalModeOn: 'threadApprovalModeOn',
    MessageReactionAdd: 'messageReactionAdd',
    ThreadMemberRemove: 'threadMemberRemove',
    ThreadColorUpdate: 'threadColorUpdate',
    ThreadEmojiUpdate: 'threadEmojiUpdate',
    ThreadAdminRemove: 'threadAdminRemove',
    ThreadImageUpdate: 'threadImageUpdate',
    ThreadMemberAdd: 'threadMemberAdd',
    ThreadAdminAdd: 'threadAdminAdd',
    MessageTyping: 'messageTyping',
    MessageCreate: 'messageCreate',
    MessageDelete: 'messageDelete',
    ThreadCallEnd: 'threadCallEnd',
    MessageReply: 'messageReply',
    ThreadRename: 'threadRename',
    GroupLeave: 'groupLeave',
    GroupJoin: 'groupJoin',
    UserRead: 'userRead',

    Ready: 'ready',
    Error: 'error',
    Debug: 'debug',
})